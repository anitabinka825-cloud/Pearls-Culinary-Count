import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config.js';
import { HttpError } from '../utils/http.js';

const c = config.cloudinary;
export const cloudinaryConfigured = Boolean(c.cloudName && c.apiKey && c.apiSecret);

if (cloudinaryConfigured) {
  cloudinary.config({ cloud_name: c.cloudName, api_key: c.apiKey, api_secret: c.apiSecret, secure: true });
}

/** Streams an in-memory buffer (from Multer) to Cloudinary. Returns { url, publicId }. */
export function uploadImage(buffer, { folder = '', publicId } = {}) {
  if (!cloudinaryConfigured) throw new HttpError(503, 'Image uploads are not configured yet (Cloudinary keys missing).');
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: [c.folder, folder].filter(Boolean).join('/'), public_id: publicId, resource_type: 'image', overwrite: true },
      (err, result) => (err ? reject(err) : resolve({ url: result.secure_url, publicId: result.public_id })),
    );
    stream.end(buffer);
  });
}
