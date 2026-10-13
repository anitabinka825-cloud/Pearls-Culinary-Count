/// <reference types="vite/client" />
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isPlaceholder = (val: string | undefined): boolean => {
  if (!val || typeof val !== 'string') return true;
  const lower = val.trim().toLowerCase();
  if (lower === '') return true;
  const placeholders = [
    'your_firebase',
    'your_project',
    'your_sender',
    'your_app',
    'your_api',
    'placeholder',
    'mock',
    'example',
    'todo'
  ];
  return placeholders.some(p => lower.includes(p));
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && !isPlaceholder(firebaseConfig.apiKey) &&
  firebaseConfig.authDomain && !isPlaceholder(firebaseConfig.authDomain) &&
  firebaseConfig.projectId && !isPlaceholder(firebaseConfig.projectId) &&
  firebaseConfig.storageBucket && !isPlaceholder(firebaseConfig.storageBucket) &&
  firebaseConfig.messagingSenderId && !isPlaceholder(firebaseConfig.messagingSenderId) &&
  firebaseConfig.appId && !isPlaceholder(firebaseConfig.appId)
);

let app: FirebaseApp | undefined;
let authInstance: Auth | null = null;
let googleProviderInstance: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(app);
    googleProviderInstance = new GoogleAuthProvider();
  } catch (e) {
    console.error('Failed to initialize Firebase app:', e);
  }
}

export const auth = authInstance as Auth;
export const googleProvider = googleProviderInstance as GoogleAuthProvider;
