export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** Express 4 does not catch rejected promises - wrap async handlers with this. */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const isEmail = (s) => typeof s === 'string' && s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export function assertPassword(pw) {
  if (typeof pw !== 'string' || pw.length < 8) throw new HttpError(400, 'Password must be at least 8 characters.');
  if (pw.length > 72) throw new HttpError(400, 'Password must be 72 characters or fewer.');
}
