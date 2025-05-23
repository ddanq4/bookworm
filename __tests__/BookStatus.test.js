import { render, screen, fireEvent } from '@testing-library/react';
import BookCard from '@/components/BookCard';
import React from 'react';

// Мокаем auth
jest.mock('@/firebase/firebaseConfig', () => ({
    auth: { currentUser: { uid: '123' } },
    db: {},
}));

// Мокаем window.alert
beforeAll(() => {
    window.alert = jest.fn();
});

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    }),
}));

const mockBook = {
    id: '42',
    title: 'Test Book',
    authors: [{ name: 'Author X' }],
    formats: { 'image/jpeg': '/default-avatar.png' },
};

describe('BookCard status change', () => {
    it('отображает и вызывает статус "reading"', async () => {
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
