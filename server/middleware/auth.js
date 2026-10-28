import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { getUserById } from '../store.js';
import { HttpError, asyncHandler } from '../utils/http.js';

export const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

/** Requires a valid Bearer token. Loads the user fresh so role changes / deletions apply immediately. */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new HttpError(401, 'Please sign in.');
  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);
  } catch {
    throw new HttpError(401, 'Your session has expired. Please sign in again.');
  }
  const user = await getUserById(payload.sub);
  if (!user) throw new HttpError(401, 'Account not found.');
  req.user = user;
  next();
});

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return next(new HttpError(403, 'You do not have access to this.'));
  next();
};
