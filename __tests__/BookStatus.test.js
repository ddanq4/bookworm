import { render, screen, fireEvent } from '@testing-library/react';
import BookCard from '@/components/BookCard';
import React from 'react';

jest.mock('@/firebase/firebaseConfig', () => ({
    auth: { currentUser: { uid: '123' } },
    db: {
        doc: () => ({}),
        getDoc: () => Promise.resolve({ exists: () => false }),
        setDoc: () => Promise.resolve(),
        updateDoc: () => Promise.resolve(),
    }
}));

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    }),
}));

beforeAll(() => {
    window.alert = jest.fn();
});

const mockBook = {
    id: '42',
    title: 'Test Book',
    authors: [{ name: 'Author X' }],
    formats: { 'image/jpeg': '/default-avatar.png' },
};

describe('BookCard status change', () => {
    it('отображает и вызывает статус "reading"', () => {
        const onStatusUpdate = jest.fn();
        render(<BookCard book={mockBook} status={null} onStatusUpdate={onStatusUpdate} />);
        fireEvent.click(screen.getByText(/Читаю/i));
        expect(onStatusUpdate).toHaveBeenCalled();
    });

    it('можно выбрать "Хочу прочитати" и "Прочитано"', () => {
        const onStatusUpdate = jest.fn();
        render(<BookCard book={mockBook} status={null} onStatusUpdate={onStatusUpdate} />);
        fireEvent.click(screen.getByText(/Хочу прочитати/i));
        expect(onStatusUpdate).toHaveBeenCalled();
        fireEvent.click(screen.getByText(/Прочитано/i));
        expect(onStatusUpdate).toHaveBeenCalled();
    });
});
