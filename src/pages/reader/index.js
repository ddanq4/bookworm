import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/reader.module.css';
import { auth, db } from '@/firebase/firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';

export default function ReaderPage() {
    const router = useRouter();
    const { url, title, id } = router.query;

    const [text, setText] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [fontSize, setFontSize] = useState(16);
    const increaseFont = () => setFontSize(prev => Math.min(prev + 2, 32));
    const decreaseFont = () => setFontSize(prev => Math.max(prev - 2, 12));

    const [theme, setTheme] = useState('dark');
    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    const scrollRef = useRef();
    const [selection, setSelection] = useState('');
    const [noteInput, setNoteInput] = useState('');
    const [notes, setNotes] = useState([]);
    const [activeNote, setActiveNote] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [showNotePrompt, setShowNotePrompt] = useState(false);
    const [notePosition, setNotePosition] = useState({ x: 0, y: 0 });
    const [editMode, setEditMode] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    const handleAddOrUpdateNote = async () => {
        const user = auth.currentUser;
        if (!user || !(noteInput || editingText) || !id) return;

        const ref = doc(db, 'users', user.uid, 'library', id);
        const newNote = {
            selection: editMode ? activeNote.selection : selection,
            text: editMode ? editingText : noteInput,
            date: new Date().toISOString(),
        };

        const updatedNotes = editMode
            ? notes.map(n => (n.selection === activeNote.selection ? newNote : n))
            : [...notes, newNote];

        await updateDoc(ref, { notes: updatedNotes });
        setNotes(updatedNotes);
        setNoteInput('');
        setEditingText('');
        setSelection('');
        setShowNotePrompt(false);
        setActiveNote(null);
        setEditMode(false);
    };

    const handleDeleteNote = async (note) => {
        const user = auth.currentUser;
        if (!user || !id) return;

        const ref = doc(db, 'users', user.uid, 'library', id);
        const updatedNotes = notes.filter(n => n.selection !== note.selection);
        await updateDoc(ref, { notes: updatedNotes });
        setNotes(updatedNotes);
        setActiveNote(null);
    };

    const handleJumpToText = (selection) => {
        const pre = document.querySelector('pre');
        if (!pre || !selection) return;

        const old = document.getElementById('note-temp');
        if (old) old.replaceWith(...old.childNodes);

        const walker = document.createTreeWalker(pre, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            const node = walker.currentNode;
            const idx = node.data.indexOf(selection);
            if (idx !== -1) {
                const range = document.createRange();
                const span = document.createElement('span');
                span.id = 'note-temp';
                span.className = styles.highlight || 'highlight';
                range.setStart(node, idx);
                range.setEnd(node, idx + selection.length);
                range.surroundContents(span);
                span.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setTimeout(() => {
                    span.replaceWith(...span.childNodes);
                }, 2000);

                break;
            }
        }
    };

    useEffect(() => {
        const handleMouseUp = (e) => {
            const sel = window.getSelection();
            const text = sel?.toString();
            if (!text || text.length < 3) return;
            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setNotePosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
            setSelection(text);
            setShowNotePrompt(true);
        };
        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, []);

    useEffect(() => {
        if (!url) return;
        const fetchText = async () => {
            try {
                const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
                const res = await fetch(proxyUrl);
                if (!res.ok) throw new Error();
                const content = await res.text();
                setText(content);
            } catch (e) {
                setError('Помилка при завантаженні тексту.');
            } finally {
                setLoading(false);
            }
        };
        fetchText();
    }, [url]);

    useEffect(() => {
        if (!loading && text) {
            const restore = async () => {
                const user = auth.currentUser;
                if (!user || !id) return;
                const ref = doc(db, 'users', user.uid, 'library', id);
                const snap = await getDoc(ref);
                const data = snap.data();
                setNotes(data?.notes || []);
                const savedScroll = data?.scrollTop || 0;

                let attempts = 0;
                const checkScroll = () => {
                    if (scrollRef.current?.scrollHeight > 0) {
                        scrollRef.current.scrollTop = savedScroll;
                    } else if (attempts < 10) {
                        attempts++;
                        setTimeout(checkScroll, 100);
                    }
                };
                checkScroll();
            };
            restore();
        }
    }, [loading, text]);

    useEffect(() => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);
    }, [theme]);

    useEffect(() => {
        const saveScroll = async () => {
            const user = auth.currentUser;
            if (!user || !id) return;
            try {
                const ref = doc(db, 'users', user.uid, 'library', id);
                setSaveStatus('Сохранение...');
                const scrollY = scrollRef.current?.scrollTop ?? 0;
                await setDoc(ref, { scrollTop: scrollY }, { merge: true });
                setSaveStatus('Сохранено!');
                setTimeout(() => setSaveStatus(''), 1500);
            } catch (e) {
                console.warn('Scroll save error:', e);
            }
        };

        const onScroll = () => {
            clearTimeout(window.__scrollTimeout);
            window.__scrollTimeout = setTimeout(saveScroll, 1000);
        };

        const el = scrollRef.current;
        if (el) el.addEventListener('scroll', onScroll);
        return () => el?.removeEventListener('scroll', onScroll);
    }, [id]);

    useEffect(() => {
        const handleClickOutsideNotePopup = (e) => {
            if (!e.target.closest(`.${styles.notePopupContent}`)) {
                setActiveNote(null);
                setEditMode(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutsideNotePopup);
        return () => document.removeEventListener('mousedown', handleClickOutsideNotePopup);
    }, []);

    useEffect(() => {
        const handleClickOutsidePrompt = (e) => {
            if (!e.target.closest(`.${styles.notePrompt}`)) {
                setShowNotePrompt(false);
                setSelection('');
                setNoteInput('');
            }
        };
        document.addEventListener('mousedown', handleClickOutsidePrompt);
        return () => document.removeEventListener('mousedown', handleClickOutsidePrompt);
    }, []);

    if (loading) return <p className={styles.loading}>Завантаження...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.reader}>
            <aside className={styles.sidebar}>
                <button onClick={async () => {
                    const user = auth.currentUser;
                    if (user && id && scrollRef.current) {
                        const ref = doc(db, 'users', user.uid, 'library', id);
                        await setDoc(ref, { scrollTop: scrollRef.current.scrollTop }, { merge: true });
                    }
                    router.push('/library');
                }}>Повернутися до бібліотеки</button>
                <button onClick={toggleTheme}>{theme === 'dark' ? '☀️ Світла тема' : '🌙 Темна тема'}</button>
                <div className={styles.fontControl}>
                    <button onClick={decreaseFont}>−</button>
                    <span>{fontSize}px</span>
                    <button onClick={increaseFont}>+</button>
                </div>
            </aside>

            <main className={styles.main} style={{ fontSize }}>
                <div className={styles.scrollable} ref={scrollRef}>
                    <h1 className={styles.title}>{title || 'Без назви'}</h1>
                    <pre className={styles.text}>{text}</pre>
                    {saveStatus && <div className={styles.saveStatus}>{saveStatus}</div>}
                </div>
            </main>

            <aside className={styles.sidebarRight}>
                <h3>Нотатки</h3>
                {notes.sort((a, b) => new Date(b.date) - new Date(a.date)).map((note, i) => (
                    <div key={i} className={styles.noteItem} onClick={() => setActiveNote(note)}>
                        <strong>{new Date(note.date).toLocaleDateString()}</strong> — {note.selection.slice(0, 30)}...
                    </div>
                ))}
            </aside>

            {showNotePrompt && (
                <div
                    className={styles.notePrompt}
                    style={{ top: `${notePosition.y}px`, left: `${notePosition.x}px`, position: 'absolute' }}
                >
                    <blockquote>{selection}</blockquote>
                    <textarea
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Введіть нотатку..."
                    />
                    <button onClick={handleAddOrUpdateNote}>Зберегти</button>
                </div>
            )}

            {activeNote && (
                <div className={styles.notePopup}>
                    <div className={styles.notePopupContent}>
                        <h3>Нотатка</h3>
                        <p className={styles.noteDate}><strong>Дата:</strong> {new Date(activeNote.date).toLocaleString()}</p>

                        <blockquote className={styles.selectedQuote}>{activeNote.selection}</blockquote>

                        {editMode ? (
                            <textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                placeholder="Редагувати нотатку..."
                            />
                        ) : (
                            <p>{activeNote.text}</p>
                        )}
                        <div className={styles.noteActions}>
                            <button onClick={() => handleJumpToText(activeNote.selection)}>Перейти</button>
                            <button onClick={() => {
                                setEditMode(true);
                                setEditingText(activeNote.text);
                            }}>Редагувати</button>
                            <button onClick={() => handleDeleteNote(activeNote)}>Видалити</button>
                            {editMode && <button onClick={handleAddOrUpdateNote}>Зберегти</button>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );}
