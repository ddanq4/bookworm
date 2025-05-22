// components/Header.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import LoginPopup from './LoginButton';
import styles from './Header.module.css';

export default function Header() {
    const [avatar, setAvatar] = useState(null);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const snap = await getDoc(doc(db, 'users', user.uid));
                if (snap.exists()) {
                    const data = snap.data();
                    setAvatar(data.avatar || '/default-avatar.png');
                } else {
                    setAvatar('/default-avatar.png');
                }
            } else {
                setAvatar(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <>
            <header className={styles.headerBar}>
                <div className={styles.logo}>BookWorm</div>
                <div className={styles.rightSection}>
                    <nav className={styles.navLinks}>
                        <Link href="/">Каталог</Link>
                        <Link href="/library">Бібліотека</Link>
                    </nav>
                    {avatar ? (
                        <Link href="/account">
                            <div
                                className={styles.avatar}
                                style={{ backgroundImage: `url(${avatar})` }}
                            ></div>
                        </Link>
                    ) : (
                        <div
                            className={styles.loginButton}
                            onClick={() => setShowLoginPopup(true)}
                        >
                            Увійти
                        </div>
                    )}
                </div>
            </header>

            {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}
        </>
    );
}
