// pages/account.js
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
    onAuthStateChanged,
    sendPasswordResetEmail,
    signOut,
} from 'firebase/auth';
import {
    doc,
    getDoc,
    updateDoc,
    setDoc,
} from 'firebase/firestore';
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} from 'firebase/storage';
import { auth, db } from '@/firebase/firebaseConfig';
import styles from '@/styles/Account.module.css';

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');


    const [loading, setLoading] = useState(true);
    const [unauthenticated, setUnauthenticated] = useState(false);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            if (!u) {
                setUnauthenticated(true);
                setLoading(false);
                return;
            }
            setUser(u);
            setEmail(u.email);
            const docRef = doc(db, 'users', u.uid);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                const data = snap.data();
                setName(data.name || '');
                setAvatar(data.avatar || '');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);





    const handleResetPassword = async () => {
        if (!user?.email) {
            alert('Користувача не знайдено');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, user.email);
            alert(`Лист для зміни пароля надіслано на ${user.email}`);
        } catch (error) {
            console.error('Помилка при надсиланні листа:', error);
            alert('Не вдалося надіслати листа на зміну пароля.');
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    if (unauthenticated) return <p>Будь ласка, увійдіть у свій акаунт.</p>;
    if (loading) return <p>Завантаження...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        margin: '0 auto 10px',
                        backgroundImage: `url(${avatar || '/default-avatar.png'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#000',
                    }}
                ></div>



                <input
                    type="text"
                    value={name}
                    onChange={async (e) => {
                        const newName = e.target.value;
                        setName(newName);
                        if (user) {
                            const userDocRef = doc(db, 'users', user.uid);
                            await setDoc(userDocRef, { name: newName }, { merge: true });
                            console.log('📝 name auto-saved:', newName);
                        }
                    }}
                    placeholder="Ваше ім'я"
                    className={styles.nickname}
                />



                <button className={styles.button} onClick={handleResetPassword}>
                    Змінити пароль
                </button>
                <p>
                    <a href="#" onClick={handleLogout}>
                        Вийти з акаунту
                    </a>
                </p>
                <p style={{ color: '#fff', wordBreak: 'break-all', fontSize: 12 }}>{avatar}</p>
            </div>
        </div>
    );
}
