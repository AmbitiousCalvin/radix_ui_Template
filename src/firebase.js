import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAh3VIYEbQND0YNtgxjERteK5rhO1B4Usc",
  authDomain: "radix-3021b.firebaseapp.com",
  projectId: "radix-3021b",
  storageBucket: "radix-3021b.firebasestorage.app",
  messagingSenderId: "589202483059",
  appId: "1:589202483059:web:670945dc59c19502fa4706",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const usersRef = collection(db, "users");
export const messagesRef = collection(db, "messages");

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (error) {
    console.log(error);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
  }
};
