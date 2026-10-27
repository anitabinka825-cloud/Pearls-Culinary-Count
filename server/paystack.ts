/** Thin Paystack client (https://api.paystack.co). Amounts are in pesewas (GH₵ 1 = 100). */

export class PaystackError extends Error {}
export class PaystackNotConfigured extends Error {}

export interface InitInput {
  email: string;
  amountPesewas: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}
export interface VerifiedTransaction {
  /** Paystack status: success | failed | abandoned | ongoing | pending | processing | queued | reversed */
  status: string;
  amountPesewas: number;
  currency: string;
  reference: string;
  channel: string;
}
export interface PaystackClient {
  initialize(input: InitInput): Promise<{ authorizationUrl: string; reference: string }>;
  verify(reference: string): Promise<VerifiedTransaction>;
}

let override: PaystackClient | null = null;
export function setPaystackClient(c: PaystackClient | null) {
  override = c;
}

export const secretKey = () => process.env.PAYSTACK_SECRET_KEY || '';

/** "card,mobile_money" by default (Ghana). Set PAYSTACK_CHANNELS=all to let Paystack show every enabled channel. */
function channels(): string[] | undefined {
  const raw = (process.env.PAYSTACK_CHANNELS ?? 'mobile_money,card').trim();
  if (!raw || raw === 'all') return undefined;
  return raw.split(',').map((c) => c.trim()).filter(Boolean);
}

async function call(path: string, init: RequestInit = {}) {
  const key = secretKey();
  if (!key) throw new PaystackNotConfigured('PAYSTACK_SECRET_KEY is not set');
  let res: Response;
  try {
    res = await fetch(`https://api.paystack.co${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new PaystackError('Could not reach Paystack');
  }
  const json: any = await res.json().catch(() => ({}));
  if (!res.ok || json.status !== true) throw new PaystackError(json.message || `Paystack error ${res.status}`);
  return json.data;
}

const real: PaystackClient = {
  async initialize(i) {
    const data = await call('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email: i.email,
        amount: i.amountPesewas,
        currency: 'GHS',
        reference: i.reference,
        callback_url: i.callbackUrl,
        channels: channels(),
        metadata: i.metadata,
      }),
    });
    return { authorizationUrl: data.authorization_url, reference: data.reference };
  },
  async verify(reference) {
    const d = await call(`/transaction/verify/${encodeURIComponent(reference)}`);
    return {
      status: String(d.status),
      amountPesewas: Number(d.amount),
      currency: String(d.currency),
      reference: String(d.reference),
      channel: String(d.channel || ''),
    };
  },
};

export const getPaystack = (): PaystackClient => override ?? real;
export const paystackConfigured = () => !!override || !!secretKey();
