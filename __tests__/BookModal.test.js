import { render, screen } from '@testing-library/react';
import BookModal from '@/components/BookModal';
import React from 'react';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    }),
}));

const book = {
    id: '1',
    title: 'Modal Book',
    authors: [{ name: 'Author X' }],
    formats: { 'image/jpeg': 'https://example.com/cover.jpg' },
    description: 'Description text'
};

describe('BookModal', () => {
    it('отображает данные книги в модалке', () => {
        render(
            <BookModal
                book={book}
                status="want"
                setStatus={() => {}}
                onClose={() => {}}
                onStatusUpdate={() => {}}
            />
        );

        expect(screen.getByText(/Modal Book/i)).toBeInTheDocument();
        expect(screen.getByText(/Author X/i)).toBeInTheDocument();
        expect(screen.getByText(/Description text/i)).toBeInTheDocument();
    });
});
