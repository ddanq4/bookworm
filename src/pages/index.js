import { useEffect, useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import { auth, db } from '@/firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import BookCard from '../components/BookCard';
import styles from './index.module.css';

export default function Home() {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('Усі');
    const [searchTerm, setSearchTerm] = useState('');
    const [showGenres, setShowGenres] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const observer = useRef();
    const genreRef = useRef(null);

    const fetchBooks = async (reset = false, currentPage = 1, query = '') => {
        setLoading(true);

        // 1. Получаем книги из Gutendex
        const res = await fetch(`https://gutendex.com/books?search=${encodeURIComponent(query)}&page=${currentPage}`);
        const data = await res.json();
        const items = data.results || [];

        // 2. Получаем статусы пользователя
        let statusMap = {};
        const user = auth.currentUser;
        if (user) {
            const ref = collection(db, 'users', user.uid, 'library');
            const snapshot = await getDocs(ref);
            snapshot.forEach(doc => {
                statusMap[doc.id] = doc.data().status;
            });
        }

        // 3. Вставляем статусы в книги
        const booksWithStatus = items.map(book => ({
            ...book,
            status: statusMap[book.id] || null
        }));

        // 4. Обновляем список книг
        if (reset) {
            setBooks(booksWithStatus);
            extractGenres(booksWithStatus);
        } else {
            setBooks(prev => [...prev, ...booksWithStatus]);
        }

        setLoading(false);
    };

    const extractGenres = (items) => {
        const genreSet = new Set();
        items.forEach(book => {
            book.subjects?.forEach(sub => genreSet.add(sub));
        });
        setGenres(['Усі', ...Array.from(genreSet).sort()]);
    };

    useEffect(() => {
        setPage(1);
        setBooks([]);
        fetchBooks(true, 1, searchTerm);
    }, [searchTerm, selectedGenre]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (genreRef.current && !genreRef.current.contains(e.target)) {
                setShowGenres(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const lastBookRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchBooks(false, page, searchTerm);
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, page, searchTerm]);

    const filteredBooks = books.filter(book => {
        if (selectedGenre === 'Усі') return true;
        return book.subjects?.includes(selectedGenre);
    });

    return (
        <>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Jolly+Lodger&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className={styles.searchContainer}>
                <div className={styles.searchWrapper}>
                    <span className={styles.icon}>
                        <img src="/search.svg" alt="search" />
                    </span>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Пошук книг або автора..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className={styles.filtersRow}>
                    <div className={styles.dropdownWrapper} ref={genreRef}>
                        <div className={styles.filterTrigger} onClick={() => setShowGenres(prev => !prev)}>
                            Жанр
                        </div>
                        {showGenres && (
                            <ul className={styles.dropdown}>
                                {genres.map((g, i) => (
                                    <li key={i} onClick={() => {
                                        setSelectedGenre(g);
                                        setShowGenres(false);
                                    }}>{g}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                {filteredBooks.map((book, index, arr) => {
                    const card = <BookCard key={book.id} book={book} status={book.status} />;
                    return index === arr.length - 1
                        ? <div ref={lastBookRef} key={book.id}>{card}</div>
                        : card;
                })}
            </div>

            {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Завантаження...</div>}
        </>
    );
}
