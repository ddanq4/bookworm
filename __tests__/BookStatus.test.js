import { render, screen, fireEvent } from '@testing-library/react';
import BookCard from '@/components/BookCard';
import React from 'react';
import { act } from 'react-dom/test-utils';

jest.mock('@/firebase/firebaseConfig', () => ({
    auth: { currentUser: { uid: '123' } },
    db: {},
}));

jest.mock('firebase/firestore', () => ({
    doc: () => ({}),
    getDoc: () => Promise.resolve({ exists: () => false }),
    setDoc: () => Promise.resolve(),
    updateDoc: () => Promise.resolve(),
    serverTimestamp: () => 'MOCK_TIMESTAMP',
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
    it('отображает и вызывает статус "reading"', async () => {
        const onStatusUpdate = jest.fn();
        render(<BookCard book={mockBook} status={null} onStatusUpdate={onStatusUpdate} />);
        await act(async () => {
            fireEvent.click(screen.getByText(/Читаю/i));
        });
        expect(onStatusUpdate).toHaveBeenCalled();
    });
});