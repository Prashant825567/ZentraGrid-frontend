import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

const envApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '';

export const isFirebaseConfigured = Boolean(
  envApiKey && 
  envApiKey.trim().length > 15 && 
  !envApiKey.includes('AIzaSyBVYRNNyBxtXlcXFTUFB') &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

export const firebaseConfig = {
  apiKey: envApiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "zentragrid.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "zentragrid",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "zentragrid.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "873269002556",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:873269002556:web:9f14acabe4403eb3001e39",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigured && firebaseConfig.apiKey) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (e) {
    console.warn('Firebase initialization skipped or failed:', e);
  }
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { app, auth };
