import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { singleImage } from '../middleware/upload.js';
import { uploadImage } from '../services/cloudinary.js';
import { updateProfile, setAvatar, toPublicUser } from '../store.js';
import { HttpError, asyncHandler } from '../utils/http.js';

const router = Router();
router.use(requireAuth);

router.patch('/me', asyncHandler(async (req, res) => {
  const { name } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || name.length > 100) throw new HttpError(400, 'Enter a valid name.');
  res.json({ user: toPublicUser(await updateProfile(req.user.id, { name })) });
}));

// Multer (memory) -> Cloudinary -> URL saved on the user.
router.post('/me/avatar', singleImage('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) throw new HttpError(400, 'Choose an image to upload.');
  const { url } = await uploadImage(req.file.buffer, { folder: 'avatars', publicId: req.user.id });
  res.json({ user: toPublicUser(await setAvatar(req.user.id, url)) });
}));

export default router;
