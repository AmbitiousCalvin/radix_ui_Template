// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZ5pm6UKkZ4nwzTf9fdxp8LKIi1VC7ti0",
  authDomain: "fir-chat-1ef4f.firebaseapp.com",
  projectId: "fir-chat-1ef4f",
  storageBucket: "fir-chat-1ef4f.firebasestorage.app",
  messagingSenderId: "119990007107",
  appId: "1:119990007107:web:cc019cd5b3ddee77edabf6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const colRef = collection(db, "messages");

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result.user);
  } catch (err) {
    console.log(err);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.log(err);
  }
};

export {
  colRef,
  db,
  auth,
  provider,
  signInWithPopup,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
};
