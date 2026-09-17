import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyBVYRNNyBxtXlcXFTUFB-XH1ggNl030u4",
  authDomain: "zentragrid.firebaseapp.com",
  projectId: "zentragrid",
  storageBucket: "zentragrid.firebasestorage.app",
  messagingSenderId: "873269002556",
  appId: "1:873269002556:web:9f14acabe4403eb3001e39",
  measurementId: "G-5TYYQRFRZ3"
};

let app: FirebaseApp;
let auth: Auth;

if (typeof window !== 'undefined') {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  // SSR placeholder
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { app, auth };
