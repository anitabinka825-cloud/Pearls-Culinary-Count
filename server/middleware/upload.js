import multer from 'multer';
import { HttpError } from '../utils/http.js';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const upload = multer({
  storage: multer.memoryStorage(), // keep in RAM, then forward to Cloudinary - nothing touches disk
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) =>
    ALLOWED.has(file.mimetype) ? cb(null, true) : cb(new HttpError(400, 'Only JPG, PNG, WebP or GIF images are allowed.')),
});

/** Usage: router.post('/x', singleImage('avatar'), handler). Converts Multer errors into clean 400s. */
export const singleImage = (field) => (req, res, next) =>
  upload.single(field)(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') return next(new HttpError(400, 'Image must be 5 MB or smaller.'));
    next(err instanceof HttpError ? err : new HttpError(400, err.message || 'Upload failed.'));
  });
