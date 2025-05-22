import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-VupWki_1ySw7k-3RlJvHm5ya3sRcDAk",

  authDomain: "bookworm-8fc34.firebaseapp.com",

  projectId: "bookworm-8fc34",

  storageBucket: "bookworm-8fc34.firebasestorage.app",

  messagingSenderId: "680256528509",

  appId: "1:680256528509:web:2b9af934f14c31ac1e9114",

  measurementId: "G-RHXC8EF0DR"
};

import { getApps, getApp } from 'firebase/app';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);