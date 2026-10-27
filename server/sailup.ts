import crypto from 'node:crypto';

const BASE_URL = (process.env.SAILUP_BASE_URL || 'https://api.sailup.io/v1').replace(/\/$/, '');

export interface SmsCredits {
  balance: number;
  autoTopup: { enabled: boolean; threshold: number; topupQuantity: number };
}

/** The two things the app needs from an SMS provider. Replaceable in tests. */
export interface SmsTransport {
  send(to: string, body: string): Promise<{ id: string }>;
  credits(): Promise<SmsCredits>;
}

let transport: SmsTransport | null | undefined;
export function setSmsTransport(t: SmsTransport | null) {
  transport = t;
}
export function getSmsTransport(): SmsTransport | null {
  if (transport === undefined) transport = sailupFromEnv();
  return transport;
}

export class SmsError extends Error {}

/** Sailup REST client. Returns null when SAILUP_API_KEY is not set, so local dev works without SMS. */
export function sailupFromEnv(fetchImpl: typeof fetch = fetch): SmsTransport | null {
  const key = process.env.SAILUP_API_KEY;
  if (!key) return null;
  const headers = () => ({ Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' });

  const call = async (path: string, init: RequestInit) => {
    let res: Response;
    try {
      res = await fetchImpl(`${BASE_URL}${path}`, { ...init, headers: headers(), signal: AbortSignal.timeout(10_000) });
    } catch {
      throw new SmsError('Could not reach Sailup');
    }
    const text = await res.text();
    if (!res.ok) throw new SmsError(`Sailup ${res.status}: ${text.slice(0, 200)}`);
    try {
      return JSON.parse(text);
    } catch {
      throw new SmsError('Unexpected response from Sailup');
    }
  };

  return {
    async send(to, body) {
      // The sender ID must be registered and approved in the Sailup dashboard first.
      const from = process.env.SAILUP_SENDER_ID;
      if (!from) throw new SmsError('SAILUP_SENDER_ID is not set');
      const r = await call('/sms/', { method: 'POST', body: JSON.stringify({ from, to: [to], body }) });
      if (!r?.id) throw new SmsError('Sailup did not return a message id');
      return { id: String(r.id) };
    },
    async credits() {
      const r = await call('/sms/credits/', { method: 'GET' });
      return {
        balance: Number(r.balance) || 0,
        autoTopup: {
          enabled: !!r.auto_topup?.enabled,
          threshold: Number(r.auto_topup?.threshold) || 0,
          topupQuantity: Number(r.auto_topup?.topup_quantity) || 0,
        },
      };
    },
  };
}

/**
 * Verifies a Sailup webhook: HMAC-SHA256 of `${timestamp}.${rawBody}` with the webhook secret,
 * compared (constant-time) with X-Sailup-Signature after its "sha256=" prefix.
 */
export function verifySailupSignature(raw: Buffer, signatureHeader: string, timestamp: string, secret: string): boolean {
  if (!secret || !timestamp || !signatureHeader.startsWith('sha256=')) return false;
  const received = Buffer.from(signatureHeader.slice(7), 'hex');
  const expected = crypto.createHmac('sha256', secret).update(`${timestamp}.`).update(raw).digest();
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

// ---- GSM-7 helpers: one stray character (₵, curly quote, emoji) turns 160-char SMS into 70-char ones ----
const GSM_BASIC =
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
const GSM_EXT = '^{}\\[~]|€';
const REPLACEMENTS: Record<string, string> = {
  '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', '…': '...', '×': 'x', '₵': 'GHS ', '\u00a0': ' ',
};

/** Rewrites text so it stays in the GSM-7 alphabet (accents folded, odd symbols replaced, never emoji). */
export function toGsm(text: string): string {
  let out = '';
  for (const ch of text.replace(/\s+/g, ' ').trim()) {
    if (REPLACEMENTS[ch] !== undefined) out += REPLACEMENTS[ch];
    else if (GSM_BASIC.includes(ch) || GSM_EXT.includes(ch)) out += ch;
    else {
      const folded = ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      out += folded && [...folded].every((c) => GSM_BASIC.includes(c)) ? folded : '?';
    }
  }
  return out;
}

/** Credits one recipient will cost for a message that is already GSM-7. */
export function smsSegments(gsmText: string): number {
  const len = [...gsmText].reduce((n, c) => n + (GSM_EXT.includes(c) ? 2 : 1), 0);
  return len <= 160 ? 1 : Math.ceil(len / 153);
}
