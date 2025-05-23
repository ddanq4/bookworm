import { render, screen } from '@testing-library/react';
import LibraryPage from '@/pages/library';
import { LibraryContext } from '@/firebase/LibraryProvider';
import React from 'react';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    }),
}));

const fakeLibrary = [
    { id: '1', status: 'want', volumeInfo: { title: 'Book 1' } },
    { id: '2', status: 'read', volumeInfo: { title: 'Book 2' } },
];

describe('LibraryPage', () => {
    it('фильтрует и отображает книги', () => {
        render(
            <LibraryContext.Provider value={{ books: fakeLibrary }}>
                <LibraryPage />
            </LibraryContext.Provider>
        );
        expect(screen.getByText('Book 1')).toBeInTheDocument();
        expect(screen.getByText('Book 2')).toBeInTheDocument();
    });
});
