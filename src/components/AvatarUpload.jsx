import { useRef, useState } from 'react';
import { Camera, User as UserIcon } from 'lucide-react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert, Spinner } from './ui.jsx';

// Demo of the Multer -> Cloudinary pipeline. Reuse the same pattern for any image upload.
export default function AvatarUpload() {
  const { user, setUser } = useAuth();
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onPick(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true); setError('');
    try { setUser((await api.uploadAvatar(file)).user); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100">
          {user.avatarUrl ? <img src={user.avatarUrl} alt="Your avatar" className="h-full w-full object-cover" /> : <UserIcon className="h-7 w-7 text-slate-400" />}
        </div>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onPick} />
        <button className="btn-secondary" disabled={busy} onClick={() => input.current.click()}>
          {busy ? <Spinner /> : <Camera className="h-4 w-4" />} {busy ? 'Uploading...' : 'Change photo'}
        </button>
      </div>
      <Alert>{error}</Alert>
    </div>
  );
}
