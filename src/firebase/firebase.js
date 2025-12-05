// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Replace the values below with your project's config from Firebase Console
const firebaseConfig = {
  apiKey: "REPLACE_WITH_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// call this once at app start to ensure an anonymous user (returns a promise)
function startAnonymousAuth() {
  return signInAnonymously(auth).catch(err => {
    // handle common errors
    console.warn('Anonymous sign-in error', err);
    throw err;
  });
}

export { app, db, auth, startAnonymousAuth, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp };
