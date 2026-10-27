import { auth } from './firebase';
import { CustomOrderEnquiry, PublicSiteSettings } from '../types';

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

/** Fetches the Pearls API; attaches the Firebase ID token automatically when signed in. */
export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set('Content-Type', 'application/json');
  const user = auth?.currentUser;
  if (user) headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
  let res: Response;
  try {
    res = await fetch(`/api${path}`, { ...init, headers });
  } catch {
    throw new ApiError('Network error. Please check your connection and try again.', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError((data as any).error || 'Request failed', res.status);
  return data as T;
}

export interface SavedEnquiry extends Omit<CustomOrderEnquiry, 'customProductText'> {
  id: number;
  reference: string;
  customProductText?: string;
  status: 'new' | 'contacted' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export const submitEnquiry = (data: CustomOrderEnquiry) =>
  apiFetch<SavedEnquiry>('/enquiries', { method: 'POST', body: JSON.stringify(data) });

export const getMyEnquiries = () => apiFetch<SavedEnquiry[]>('/enquiries/mine');

// ---- Delivery zones & orders (Stage 5) ----
export interface DeliveryZone {
  id: number;
  name: string;
  feePesewas: number;
  active: boolean;
  sortOrder: number;
}
export const getDeliveryZones = () => apiFetch<DeliveryZone[]>('/delivery-zones');

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  variantTitle: string;
  unitPricePesewas: number;
  quantity: number;
  lineTotalPesewas: number;
}
export interface Order {
  id: number;
  reference: string;
  status: 'pending_payment' | 'paid' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'failed' | 'refunded';
  fulfilment: 'delivery' | 'pickup';
  zoneName: string;
  deliveryFeePesewas: number;
  deliveryAddress: string;
  subtotalPesewas: number;
  totalPesewas: number;
  customerName: string;
  customerPhone: string;
  preferredDate: string;
  notes: string;
  createdAt: string;
  items: OrderItem[];
}
export interface NewOrderInput {
  items: { productId: string; variantId?: string; quantity: number }[];
  fulfilment: 'delivery' | 'pickup';
  zoneId?: number | null;
  deliveryAddress: string;
  preferredDate: string;
  customerName: string;
  customerPhone: string;
  notes: string;
}
export const createOrder = (input: NewOrderInput) =>
  apiFetch<Order>('/orders', { method: 'POST', body: JSON.stringify(input) });
export const getOrder = (reference: string) => apiFetch<Order>(`/orders/${encodeURIComponent(reference)}`);
export const getMyOrders = () => apiFetch<Order[]>('/orders/mine');

// ---- Payments (Stage 6) ----
export const startPayment = (reference: string) =>
  apiFetch<{ authorizationUrl: string }>(`/orders/${encodeURIComponent(reference)}/pay`, { method: 'POST' });
export const verifyPayment = (reference: string) =>
  apiFetch<{ paymentStatus: 'paid' | 'pending' | 'failed' }>(`/orders/${encodeURIComponent(reference)}/verify`, { method: 'POST' });

// ---- Admin dashboard (Stage 7). Every call is enforced server-side; the UI only hides things. ----
export interface AdminSummary {
  orders: Record<Order['status'], number>;
  activeOrders: number;
  last30Days: { paidOrders: number; revenuePesewas: number };
  newEnquiries: number;
  refundsToProcess: number;
}
export interface AdminPayment {
  id: number;
  reference: string;
  amountPesewas: number;
  status: 'pending' | 'success' | 'failed';
  channel: string;
  note: string;
  createdAt: string;
  paidAt: string | null;
}
export interface AdminOrder extends Order {
  customerEmail: string;
  updatedAt: string;
  needsRefund: boolean;
  nextStatuses: Order['status'][];
  payments: AdminPayment[];
}
export interface FlaggedPayment {
  id: number;
  reference: string;
  orderReference: string;
  customerName: string;
  customerPhone: string;
  amountPesewas: number;
  paidAt: string;
}
export type EnquiryStatus = SavedEnquiry['status'];
export interface AdminEnquiry {
  id: number;
  reference: string;
  productType: string;
  customProductText: string;
  quantity: string;
  preferredDate: string;
  size: string;
  flavour: string;
  filling: string;
  themeDesign: string;
  inscription: string;
  deliveryLocation: string;
  specialInstructions: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: EnquiryStatus;
  adminNotes: string;
  createdAt: string;
}

export const adminGetSummary = () => apiFetch<AdminSummary>('/admin/summary');
export const adminListOrders = (status: string, q: string) =>
  apiFetch<AdminOrder[]>(`/admin/orders?status=${encodeURIComponent(status)}&q=${encodeURIComponent(q)}`);
export const adminGetOrder = (reference: string) =>
  apiFetch<AdminOrder>(`/admin/orders/${encodeURIComponent(reference)}`);
export const adminUpdateOrder = (
  reference: string,
  body: { status?: Order['status']; paymentStatus?: 'refunded' },
) => apiFetch<AdminOrder>(`/admin/orders/${encodeURIComponent(reference)}`, { method: 'PATCH', body: JSON.stringify(body) });
export const adminFlaggedPayments = () => apiFetch<FlaggedPayment[]>('/admin/payments/flagged');
export const adminMarkPaymentRefunded = (id: number) =>
  apiFetch<{ ok: true }>(`/admin/payments/${id}/refunded`, { method: 'POST' });

export const adminListEnquiries = (status: string) =>
  apiFetch<AdminEnquiry[]>(`/admin/enquiries?status=${encodeURIComponent(status)}`);
export const adminUpdateEnquiry = (id: number, body: { status?: EnquiryStatus; adminNotes?: string }) =>
  apiFetch<AdminEnquiry>(`/admin/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export const adminListZones = () => apiFetch<DeliveryZone[]>('/admin/delivery-zones');
export const adminCreateZone = (body: { name: string; feePesewas: number; active: boolean }) =>
  apiFetch<DeliveryZone>('/admin/delivery-zones', { method: 'POST', body: JSON.stringify(body) });
export const adminUpdateZone = (id: number, body: Partial<{ name: string; feePesewas: number; active: boolean }>) =>
  apiFetch<DeliveryZone>(`/admin/delivery-zones/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
export const adminDeleteZone = (id: number) => apiFetch<unknown>(`/admin/delivery-zones/${id}`, { method: 'DELETE' });

// ---- SMS (Stage 8) ----
export interface AdminSms {
  id: number;
  kind: string;
  audience: 'customer' | 'owner';
  recipient: string;
  body: string;
  orderReference: string;
  enquiryReference: string;
  state: 'pending' | 'sent' | 'failed' | 'skipped';
  deliveryStatus: '' | 'pending' | 'delivered' | 'failed' | 'expired' | 'rejected';
  error: string;
  createdAt: string;
}
export type SmsCreditsInfo =
  | { configured: false }
  | { configured: true; error: string }
  | { configured: true; balance: number; autoTopup: { enabled: boolean; threshold: number; topupQuantity: number } };

export const adminListSms = () => apiFetch<AdminSms[]>('/admin/sms');
export const adminSmsCredits = () => apiFetch<SmsCreditsInfo>('/admin/sms/credits');
export const adminResendSms = (id: number) =>
  apiFetch<{ state: AdminSms['state']; error: string }>(`/admin/sms/${id}/resend`, { method: 'POST' });

// ---- Site settings (Stage 9) ----
export const getPublicSettings = () => apiFetch<PublicSiteSettings>('/settings');
export interface SiteSettingsForm {
  phone: string; whatsapp: string; email: string;
  instagram: string; facebook: string; tiktok: string; youtube: string; x: string;
  careHours: string; announcement: string;
  ordersPaused: boolean; pauseMessage: string;
  ownerAlertPhone: string;
}
export const adminGetSettings = () => apiFetch<SiteSettingsForm>('/admin/settings');
export const adminSaveSettings = (body: SiteSettingsForm) =>
  apiFetch<SiteSettingsForm>('/admin/settings', { method: 'PUT', body: JSON.stringify(body) });
