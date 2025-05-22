import { collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const saveBook = async (userId, book) => {
    const ref = doc(db, 'users', userId, 'library', book.key);
    await setDoc(ref, book);
};

export const getLibrary = async (userId) => {
    const colRef = collection(db, 'users', userId, 'library');
    const snap = await getDocs(colRef);
    return snap.docs.map(doc => doc.data());
};