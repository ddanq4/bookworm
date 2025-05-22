import { useEffect, useState, useRef } from 'react';
import { auth, db } from '@/firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import BookCard from '@/components/BookCard';
import styles from '@/styles/Library.module.css';

export default function LibraryPage() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('Усі');
    const [selectedYear, setSelectedYear] = useState('Усі');
    const [selectedStatus, setSelectedStatus] = useState('Усі');
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const [showGenres, setShowGenres] = useState(false);
    const [showYears, setShowYears] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [showSort, setShowSort] = useState(false);

    const [genres, setGenres] = useState([]);
    const [years, setYears] = useState([]);

    const genreRef = useRef(null);
    const yearRef = useRef(null);
    const statusRef = useRef(null);
    const sortRef = useRef(null);

    const statuses = [
        { value: 'Усі', label: 'Усі' },
        { value: 'want_to_read', label: 'Хочу прочитати' },
        { value: 'reading', label: 'Читаю' },
        { value: 'finished', label: 'Прочитано' }
    ];

    const sortOptions = [
        { value: 'title', label: 'Назва' },
        { value: 'status', label: 'Статус' },
        { value: 'year', label: 'Рік' },
        { value: 'date', label: 'Дата додавання' },
    ];

    useEffect(() => {
        const fetchBooks = async () => {
            const user = auth.currentUser;
            if (!user) return;
            const ref = collection(db, 'users', user.uid, 'library');
            const snapshot = await getDocs(ref);
            const data = snapshot.docs.map(doc => doc.data()).filter(b => b.status);
            setBooks(data);

            const genreSet = new Set();
            const yearSet = new Set();
            data.forEach(book => {
                const info = book.book.subjects || [];
                info.forEach(c => genreSet.add(c));
                if (book.book.copyright_year) yearSet.add(book.book.copyright_year);
            });
            setGenres(['Усі', ...Array.from(genreSet).sort()]);
            setYears(['Усі', ...Array.from(yearSet).sort()]);
        };
        fetchBooks();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (genreRef.current && !genreRef.current.contains(e.target)) setShowGenres(false);
            if (yearRef.current && !yearRef.current.contains(e.target)) setShowYears(false);
            if (statusRef.current && !statusRef.current.contains(e.target)) setShowStatus(false);
            if (sortRef.current && !sortRef.current.contains(e.target)) setShowSort(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const filtered = books.filter(b => {
        const title = b.book.title?.toLowerCase() || '';
        const matchTitle = title.includes(searchTerm.toLowerCase());
        const matchStatus = selectedStatus === 'Усі' || b.status === selectedStatus;
        const matchGenre = selectedGenre === 'Усі' || b.book.subjects?.includes(selectedGenre);
        const matchYear = selectedYear === 'Усі' || b.book.copyright_year === selectedYear;
        return matchTitle && matchStatus && matchGenre && matchYear;
    });

    const sorted = [...filtered].sort((a, b) => {
        let aValue = sortField === 'title' ? a.book.title :
            sortField === 'year' ? a.book.copyright_year :
                sortField === 'status' ? a.status :
                    sortField === 'date' ? a.addedAt?.seconds || 0 : null;
        let bValue = sortField === 'title' ? b.book.title :
            sortField === 'year' ? b.book.copyright_year :
                sortField === 'status' ? b.status :
                    sortField === 'date' ? b.addedAt?.seconds || 0 : null;

        if (aValue == null || bValue == null) return 0;
        if (sortOrder === 'asc') return aValue > bValue ? 1 : -1;
        return aValue < bValue ? 1 : -1;
    });

    return (
        <div className={styles.container}>
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
                                {genres.map(genre => (
                                    <li key={genre} onClick={() => setSelectedGenre(genre)}>
                                        {genre}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className={styles.dropdownWrapper} ref={yearRef}>
                        <div className={styles.filterTrigger} onClick={() => setShowYears(prev => !prev)}>
                            Рік
                        </div>
                        {showYears && (
                            <ul className={styles.dropdown}>
                                {years.map(year => (
                                    <li key={year} onClick={() => setSelectedYear(year)}>
                                        {year}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className={styles.dropdownWrapper} ref={statusRef}>
                        <div className={styles.filterTrigger} onClick={() => setShowStatus(prev => !prev)}>
                            Статус
                        </div>
                        {showStatus && (
                            <ul className={styles.dropdown}>
                                {statuses.map(status => (
                                    <li key={status.value} onClick={() => setSelectedStatus(status.value)}>
                                        {status.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className={styles.dropdownWrapper} ref={sortRef}>
                        <div className={styles.filterTrigger} onClick={() => setShowSort(prev => !prev)}>
                            Сортувати
                        </div>
                        {showSort && (
                            <ul className={styles.dropdown}>
                                {sortOptions.map(option => (
                                    <li key={option.value} onClick={() => handleSort(option.value)}>
                                        {option.label} {sortField === option.value ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                {sorted.map((book, index) => (
                    <BookCard key={index} book={book.book} status={book.status} />
                ))}
            </div>
        </div>
    );
}
