// The ONLY file that talks to the backend. Components import { api } and call api.something().
const BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'app_token';

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (token) => {
  try { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ }
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, formData } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (formData) payload = formData; // browser sets the multipart boundary itself
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && token) {
      setToken(null);
      window.dispatchEvent(new Event('auth:logout')); // AuthContext listens and clears the user
    }
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status);
  }
  return data;
}

export const api = {
  // health
  health: (deep = false) => request(deep ? '/health?deep=1' : '/health'),

  // auth
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  me: () => request('/auth/me'),
  verifyEmail: (token) => request('/auth/verify-email', { method: 'POST', body: { token } }),
  resendVerification: () => request('/auth/resend-verification', { method: 'POST' }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (token, password) => request('/auth/reset-password', { method: 'POST', body: { token, password } }),
  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } }),

  // profile + uploads
  updateProfile: (name) => request('/users/me', { method: 'PATCH', body: { name } }),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return request('/users/me/avatar', { method: 'POST', formData });
  },

  // admin
  listUsers: () => request('/admin/users'),

  // payments (Paystack)
  createPayment: (amount, description) => request('/payments', { method: 'POST', body: { amount, description } }),
  verifyPayment: (reference) => request(`/payments/verify/${encodeURIComponent(reference)}`),
  myPayments: () => request('/payments'),
};
