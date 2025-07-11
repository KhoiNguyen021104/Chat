import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, getRedirectResult, onAuthStateChanged } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBZSpWOvluE47AhUjxn2hamktAhgRDcyoQ",
  authDomain: "chatapp-558e4.firebaseapp.com",
  projectId: "chatapp-558e4",
  storageBucket: "chatapp-558e4.firebasestorage.app",
  messagingSenderId: "716980666830",
  appId: "1:716980666830:web:371fe5ce6d1990734d2b9f",
  measurementId: "G-7RD5WKK5NE"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, getRedirectResult, onAuthStateChanged };