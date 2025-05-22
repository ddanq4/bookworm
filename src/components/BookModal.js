import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { auth, db } from '@/firebase/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import styles from './BookModal.module.css';

export default function BookModal({ book, status, setStatus, onClose, onStatusUpdate }) {
    const [showMenu, setShowMenu] = useState(false);
    const [bookError, setBookError] = useState(null);
    const [gutendexStatus, setGutendexStatus] = useState(null);
    const router = useRouter();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        const formats = book.formats || {};
        const textUrl = formats['text/plain; charset=utf-8']
            || formats['text/html; charset=utf-8']
            || formats['text/plain']
            || formats['text/html'];

        if (textUrl) {
            setBookError(null);
            setGutendexStatus('знайдено');
        } else {
            setBookError('Повний текст книги недоступний.');
            setGutendexStatus('не знайдено');
        }
    }, [book]);

    // 🔄 Загружаем статус из Firestore, если не передан
    useEffect(() => {
        const fetchStatus = async () => {
            const user = auth.currentUser;
            if (!user || status !== undefined) return;

            const ref = doc(db, 'users', user.uid, 'library', String(book.id));
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const data = snap.data();
                setStatus(data.status || null);
            }
        };
        fetchStatus();
    }, [book, status, setStatus]);

    const handleChangeStatus = async (newStatus) => {
        const user = auth.currentUser;
        if (!user) return alert('Увійдіть, щоб оновити статус');

        const ref = doc(db, 'users', user.uid, 'library', String(book.id));
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
            await updateDoc(ref, { status: newStatus });
        } else {
            await setDoc(ref, {
                book,
                status: newStatus,
                addedAt: serverTimestamp(),
            });
        }

        setStatus(newStatus);
        onStatusUpdate && onStatusUpdate();
        setShowMenu(false);
    };

    const handleRead = () => {
        const textUrl = Object.entries(book.formats || {}).find(
            ([key, value]) => key.includes('text/plain') && value.startsWith('http')
        )?.[1];



        const realTitle = book.title || book.book?.title || 'Без назви';

        if (textUrl) {
            router.push(`/reader?url=${encodeURIComponent(textUrl)}&title=${encodeURIComponent(realTitle)}&id=${book.id}`);
        } else {
            alert('Текст книги недоступний.');
        }
    };


    const image = book.formats?.['image/jpeg'] || '/default-avatar.png';
    const title = book.title || 'Без назви';
    const author = book.authors?.map(a => a.name).join(', ') || 'Невідомий автор';
    const year = book.copyright_year || '—';
    const description = book.subjects?.join(', ') || 'Опис відсутній';

    const statuses = [
        { value: 'want_to_read', label: 'Хочу прочитати' },
        { value: 'reading', label: 'Читаю' },
        { value: 'finished', label: 'Прочитано' },
        { value: null, label: '× Очистити статус' }
    ];

    const modalContent = (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose}>×</button>

                <div className={styles.header}>BookWorm</div>

                <div className={styles.content}>
                    <div className={styles.left}>
                        <img
                            src={image}
                            alt={title}
                            className={styles.image}
                        />

                        <button
                            className={styles.read}
                            onClick={handleRead}
                            disabled={!!bookError}
                            style={{ opacity: bookError ? 0.5 : 1, cursor: bookError ? 'not-allowed' : 'pointer' }}
                        >
                            {bookError ? 'Недоступно' : 'Читати зараз'}
                        </button>

                        <div className={styles.dropdownWrapper}>
                            <button className={styles.change} onClick={() => setShowMenu(prev => !prev)}>
                                Змінити статус
                            </button>
                            {showMenu && (
                                <ul className={styles.dropdown}>
                                    {statuses.map(s => (
                                        <li
                                            key={s.value ?? 'clear'}
                                            onClick={() => handleChangeStatus(s.value)}
                                            className={s.value === null ? styles.clear : ''}
                                        >
                                            {s.label}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className={styles.right}>
                        <h2 className={styles.title}>{title.toUpperCase()}</h2>
                        <p className={styles.author}>{author}</p>
                        <p className={styles.year}>{year}</p>
                        <p className={styles.status}>Активний статус: {status || '—'}</p>
                        <p className={styles.status}>Gutendex: {gutendexStatus || '—'}</p>
                        {bookError && (
                            <p className={styles.status} style={{ color: 'red' }}>
                                ❗ {bookError}
                            </p>
                        )}
                        <p className={styles.description}>Опис: {description}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
