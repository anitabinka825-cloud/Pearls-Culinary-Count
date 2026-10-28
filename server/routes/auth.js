import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { requireAuth, signToken } from '../middleware/auth.js';
import {
  createUser, getUserByEmail, getUserById, setPassword, markEmailVerified,
  createAuthToken, consumeAuthToken, toPublicUser,
} from '../store.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.js';
import { newOneTimeToken, hashToken } from '../utils/tokens.js';
import { HttpError, asyncHandler, isEmail, assertPassword } from '../utils/http.js';

const router = Router();
const HOUR = 60 * 60 * 1000;
// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

async function issueVerification(user) {
  const { token, tokenHash } = newOneTimeToken();
  await createAuthToken({ userId: user.id, type: 'verify_email', tokenHash, expiresAt: new Date(Date.now() + 24 * HOUR) });
  await sendVerificationEmail(user, token);
}

router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, name = '' } = req.body || {};
  if (!isEmail(email)) throw new HttpError(400, 'Enter a valid email address.');
  assertPassword(password);
  if (typeof name !== 'string' || name.length > 100) throw new HttpError(400, 'Name is too long.');
  if (await getUserByEmail(email)) throw new HttpError(409, 'An account with this email already exists.');

  const user = await createUser({ email, name, passwordHash: await bcrypt.hash(password, 12) });
  // Never fail sign-up because the email provider hiccupped; the user can resend from their dashboard.
  issueVerification(user).catch((e) => console.error('[auth] verification email failed:', e.message));
  res.status(201).json({ token: signToken(user), user: toPublicUser(user) });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!isEmail(email) || typeof password !== 'string') throw new HttpError(400, 'Enter your email and password.');
  const user = await getUserByEmail(email);
  const ok = await bcrypt.compare(password, user?.password_hash || DUMMY_HASH);
  if (!user || !ok) throw new HttpError(401, 'Incorrect email or password.');
  res.json({ token: signToken(user), user: toPublicUser(user) });
}));

router.get('/me', requireAuth, (req, res) => res.json({ user: toPublicUser(req.user) }));

router.post('/verify-email', asyncHandler(async (req, res) => {
  const { token } = req.body || {};
  if (typeof token !== 'string') throw new HttpError(400, 'Missing verification token.');
  const userId = await consumeAuthToken({ type: 'verify_email', tokenHash: hashToken(token) });
  if (!userId) throw new HttpError(400, 'This verification link is invalid or has expired.');
  await markEmailVerified(userId);
  res.json({ ok: true });
}));

router.post('/resend-verification', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.email_verified) return res.json({ ok: true, alreadyVerified: true });
  await issueVerification(req.user);
  res.json({ ok: true });
}));

router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body || {};
  if (!isEmail(email)) throw new HttpError(400, 'Enter a valid email address.');
  const user = await getUserByEmail(email);
  if (user) {
    const { token, tokenHash } = newOneTimeToken();
    await createAuthToken({ userId: user.id, type: 'reset_password', tokenHash, expiresAt: new Date(Date.now() + HOUR) });
    await sendPasswordResetEmail(user, token).catch((e) => console.error('[auth] reset email failed:', e.message));
  }
  // Same answer whether or not the account exists (prevents email enumeration).
  res.json({ ok: true });
}));

router.post('/reset-password', asyncHandler(async (req, res) => {
  const { token, password } = req.body || {};
  if (typeof token !== 'string') throw new HttpError(400, 'Missing reset token.');
  assertPassword(password);
  const userId = await consumeAuthToken({ type: 'reset_password', tokenHash: hashToken(token) });
  if (!userId) throw new HttpError(400, 'This reset link is invalid or has expired.');
  await setPassword(userId, await bcrypt.hash(password, 12));
  // A reset link also proves the user controls the inbox.
  await markEmailVerified(userId);
  res.json({ ok: true });
}));

router.post('/change-password', requireAuth, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  assertPassword(newPassword);
  const user = await getUserById(req.user.id);
  if (!(await bcrypt.compare(String(currentPassword || ''), user.password_hash))) {
    throw new HttpError(400, 'Current password is incorrect.');
  }
  await setPassword(user.id, await bcrypt.hash(newPassword, 12));
  res.json({ ok: true });
}));

export default router;
