import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';
import { UserProfile } from '../types';
import { apiFetch } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, phone: string) => Promise<void>;
  isAdmin: boolean;
  updateProfileDetails: (firstName: string, lastName: string, phone: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  reloadUser: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getFriendlyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please try again.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to many failed login attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled. Please try again.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection and try again.';
    case 'auth/popup-blocked':
      return 'Popup blocked by browser. Please allow popups for Google Sign-In.';
    case 'auth/account-disable':
      return 'This account has been disabled.';
    default:
      return 'An authentication error occurred. Please check your credentials and try again.';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const syncProfile = (user: User) => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const nameParts = (user.displayName || '').split(' ');
    const firstName = nameParts[0] || 'Valued';
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      firstName,
      lastName,
      phone: user.phoneNumber || '',
      createdAt: user.metadata.creationTime,
      updatedAt: user.metadata.lastSignInTime,
    };

    setUserProfile(profile);

    // Merge the server-side profile (phone number, role) when the API is reachable.
    apiFetch<{ firstName: string; lastName: string; phone: string; role: 'customer' | 'admin' }>('/me')
      .then((me) =>
        setUserProfile((prev) =>
          prev && prev.uid === user.uid
            ? { ...prev, firstName: me.firstName || prev.firstName, lastName: me.lastName || prev.lastName, phone: me.phone, role: me.role }
            : prev,
        ),
      )
      .catch(() => undefined);
  };

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        syncProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const checkConfig = () => {
    if (!isFirebaseConfigured || !auth) {
      const msg = 'Firebase is not configured. Please provide valid VITE_FIREBASE_* environment variables in .env.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone: string) => {
    try {
      clearError();
      checkConfig();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await updateProfile(user, { displayName: fullName });

      await firebaseSendEmailVerification(user);

      // Persist phone + names in our database (non-blocking for the sign-up itself).
      try {
        await apiFetch('/me', {
          method: 'PUT',
          body: JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim(), phone }),
        });
      } catch (e) {
        console.warn('Could not save profile details yet:', e);
      }
      syncProfile(user);
    } catch (err: any) {
      const friendly = err.message.includes('Firebase is not configured')
        ? err.message
        : getFriendlyAuthErrorMessage(err.code || err.message);
      setError(friendly);
      throw new Error(friendly);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      clearError();
      checkConfig();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const friendly = err.message.includes('Firebase is not configured')
        ? err.message
        : getFriendlyAuthErrorMessage(err.code || err.message);
      setError(friendly);
      throw new Error(friendly);
    }
  };

  const signInWithGoogle = async () => {
    try {
      clearError();
      checkConfig();
      const result = await signInWithPopup(auth, googleProvider);
      syncProfile(result.user);
    } catch (err: any) {
      const friendly = err.message.includes('Firebase is not configured')
        ? err.message
        : getFriendlyAuthErrorMessage(err.code || err.message);
      setError(friendly);
      throw new Error(friendly);
    }
  };

  const signOut = async () => {
    try {
      clearError();
      if (auth) {
        await firebaseSignOut(auth);
      }
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err: any) {
      const friendly = getFriendlyAuthErrorMessage(err.code || err.message);
      setError(friendly);
      throw new Error(friendly);
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      clearError();
      checkConfig();
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      // Prevent account enumeration: suppress user-not-found or invalid-email errors
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        return;
      }
      const friendly = err.message.includes('Firebase is not configured')
        ? err.message
        : getFriendlyAuthErrorMessage(err.code || err.message);
      setError(friendly);
      throw new Error(friendly);
    }
  };

  const sendEmailVerification = async () => {
    checkConfig();
    if (!auth.currentUser) throw new Error('No authenticated user found.');
    try {
      clearError();
      await firebaseSendEmailVerification(auth.currentUser);
    } catch (err: any) {
      const friendly = getFriendlyAuthErrorMessage(err.code || err.message);
      setError(friendly);
      throw new Error(friendly);
    }
  };

  const updateProfileDetails = async (firstName: string, lastName: string, phone: string) => {
    const me = await apiFetch<{ firstName: string; lastName: string; phone: string }>('/me', {
      method: 'PUT',
      body: JSON.stringify({ firstName, lastName, phone }),
    });
    if (auth?.currentUser) await updateProfile(auth.currentUser, { displayName: `${firstName} ${lastName}`.trim() });
    setUserProfile((prev) => (prev ? { ...prev, firstName: me.firstName, lastName: me.lastName, phone: me.phone } : prev));
  };

  const reloadUser = async () => {
    if (!auth || !auth.currentUser) return;
    try {
      await auth.currentUser.reload();
      setCurrentUser(auth.currentUser);
      syncProfile(auth.currentUser);
    } catch (err) {
      console.error('Error reloading user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signUp,
        isAdmin: userProfile?.role === 'admin',
        updateProfileDetails,
        signIn,
        signInWithGoogle,
        signOut,
        sendPasswordReset,
        sendEmailVerification,
        reloadUser,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

