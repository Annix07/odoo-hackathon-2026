import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAvoMKQICpY-74nyeUjhlyiGHDbF4KMnMw",
  authDomain: "hrsync-9b30a.firebaseapp.com",
  projectId: "hrsync-9b30a",
  storageBucket: "hrsync-9b30a.firebasestorage.app",
  messagingSenderId: "170107283069",
  appId: "1:170107283069:web:b659b1f37a83bc64a3f314"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
