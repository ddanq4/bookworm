import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from './firebaseConfig';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';


export const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

export const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
export const logout = () => signOut(auth);