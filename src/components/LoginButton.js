import { useEffect, useRef, useState } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import styles from './LoginButton.module.css';

export default function LoginPopup({ onClose }) {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [onClose]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', cred.user.uid), {
                uid: cred.user.uid,
                email: cred.user.email,
                name,
                createdAt: new Date(),
            });
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const cred = await signInWithPopup(auth, provider);
            await setDoc(
                doc(db, 'users', cred.user.uid),
                {
                    uid: cred.user.uid,
                    email: cred.user.email,
                    name: cred.user.displayName || '',
                    createdAt: new Date(),
                },
                { merge: true },
            );
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.loginPopup} ref={popupRef}>
                <h2 className={styles.logo}>BookWorm</h2>

                <div className={styles.formWrapper}>
                    {/* LOGIN */}
                    <form
                        onSubmit={handleLogin}
                        className={`${styles.fadeBlock} ${mode === 'login' ? styles.active : ''}`}
                    >
                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Пароль</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <div className={styles.forgot}>Забув пароль?</div>
                        </div>
                        <button type="submit" className={styles.formButton}>Увійти</button>
                        {mode === 'login' && error && <p style={{ color: 'salmon', marginTop: 6 }}>{error}</p>}
                    </form>

                    {/* REGISTER */}
                    <form
                        onSubmit={handleRegister}
                        className={`${styles.fadeBlock} ${mode === 'register' ? styles.active : ''}`}
                    >
                        <div className={styles.inputGroup}>
                            <label>Імʼя</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Пароль</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className={styles.formButton}>Зареєструватися</button>
                        {mode === 'register' && error && <p style={{ color: 'salmon', marginTop: 6 }}>{error}</p>}
                    </form>
                </div>

                <p className={styles.divider}>Або</p>

                <button className={styles.googleButton} onClick={handleGoogleLogin}>
                    Увійти через Google
                </button>

                <p
                    className={styles.linkSwitch}
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                >
                    {mode === 'login' ? 'Зареєструвати акаунт' : 'У мене вже є акаунт'}
                </p>
            </div>
        </div>
    );
}
