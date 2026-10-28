import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken } from '../api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken())); // only "loading" if there is a session to restore

  useEffect(() => {
    if (!getToken()) return;
    api.me().then((r) => setUser(r.user)).catch(() => setToken(null)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, []);

  const finish = useCallback(({ token, user: u }) => {
    setToken(token);
    setUser(u);
    return u;
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    setUser,
    login: async (email, password) => finish(await api.login({ email, password })),
    register: async (name, email, password) => finish(await api.register({ name, email, password })),
    logout: () => { setToken(null); setUser(null); },
    refreshUser: async () => setUser((await api.me()).user),
  }), [user, loading, finish]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
