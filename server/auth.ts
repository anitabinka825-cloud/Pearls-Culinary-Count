import type { Request, Response, NextFunction } from 'express';
import { getApps, initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDb } from './db.js';

export interface AuthedUser {
  id: number;
  uid: string;
  email: string;
  role: 'customer' | 'admin';
}
declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthedUser;
  }
}

/** Replaceable in tests. Returns the decoded token fields we need. */
export type TokenVerifier = (token: string) => Promise<{ uid: string; email?: string; name?: string }>;

let verifier: TokenVerifier | null = null;
export function setTokenVerifier(v: TokenVerifier) {
  verifier = v;
}

function firebaseVerifier(): TokenVerifier {
  if (!getApps().length) {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (json) initializeApp({ credential: cert(JSON.parse(json)) });
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) initializeApp({ credential: applicationDefault() });
    else initializeApp({ projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID });
  }
  return async (token) => {
    const d = await getAuth().verifyIdToken(token);
    return { uid: d.uid, email: d.email, name: d.name };
  };
}

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

async function authenticate(req: Request) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  const token = header.slice(7);
  verifier ||= firebaseVerifier();
  const decoded = await verifier(token);
  const email = (decoded.email || '').toLowerCase();
  const db = getDb();
  const [first = '', ...rest] = (decoded.name || '').split(' ');
  // Admin role is granted from the ADMIN_EMAILS allow-list on the server only.
  const isAdmin = !!email && adminEmails().includes(email);
  const { rows } = await db.query(
    `INSERT INTO customers (firebase_uid, email, first_name, last_name, role)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (firebase_uid) DO UPDATE SET email = EXCLUDED.email,
       role = CASE WHEN $6 THEN 'admin' ELSE customers.role END,
       updated_at = now()
     RETURNING id, firebase_uid, email, role`,
    [decoded.uid, email, first, rest.join(' '), isAdmin ? 'admin' : 'customer', isAdmin],
  );
  const r = rows[0];
  return { id: r.id, uid: r.firebase_uid, email: r.email, role: r.role } as AuthedUser;
}

/** Attaches req.user when a valid token is supplied; never blocks. */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    req.user = (await authenticate(req)) || undefined;
  } catch {
    req.user = undefined;
  }
  next();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authenticate(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}
