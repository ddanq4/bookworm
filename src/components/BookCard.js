import { useState } from 'react';
import { auth, db } from '@/firebase/firebaseConfig';
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import styles from './BookCard.module.css';
import BookModal from './BookModal';

export default function BookCard({ book, status: initialStatus, onStatusUpdate }) {
    const [showMenu, setShowMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState(initialStatus);

    const image = book.formats?.['image/jpeg'] || '/default-avatar.png';
    const title = book.title;
    const author = book.authors?.map(a => a.name).join(', ') || 'Невідомий автор';

    const handleAddToLibrary = async (newStatus) => {
        const user = auth.currentUser;
        if (!user) return alert('Увійдіть, щоб додати до бібліотеки');

        const ref = doc(db, 'users', user.uid, 'library', String(book.id));
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
            await updateDoc(ref, { status: newStatus });
        } else {
            await setDoc(ref, {
                status: newStatus,
                addedAt: serverTimestamp(),
                book,
            });
        }

        setStatus(newStatus);
        setShowMenu(false);
        onStatusUpdate && onStatusUpdate();
    };

    return (
        <>
            <div
                className={styles.card}
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
                onClick={() => setShowModal(true)}
            >
                <img
                    src={image}
                    alt={title}
                    className={styles.image}
                    style={{
                        borderRadius: '16px',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        pointerEvents: 'none',
                    }}
                />
                <div className={styles.overlay}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.author}>{author}</p>
                </div>

                <div className={`${styles.addMenu} ${showMenu ? styles.show : ''}`}>
                    {['want_to_read', 'reading', 'finished'].map(value => (
                        <button
                            key={value}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToLibrary(value);
                            }}
                            className={status === value ? styles.active : ''}
                        >
                            {{
                                want_to_read: 'Хочу прочитати',
                                reading: 'Читаю',
                                finished: 'Прочитано',
                            }[value]}
                        </button>
                    ))}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToLibrary(null);
                        }}
                        className={`${styles.clear} ${!status ? styles.active : ''}`}
                    >
                        × Очистити статус
                    </button>
                </div>
            </div>

            {showModal && (
                <BookModal
                    book={book}
                    status={status}
                    setStatus={setStatus}
                    onClose={() => setShowModal(false)}
                    onStatusUpdate={onStatusUpdate}
                />
            )}
        </>
    );
}
