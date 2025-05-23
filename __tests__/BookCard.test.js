import { render, screen } from '@testing-library/react';
import BookCard from '@/components/BookCard';
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
    id: 'abc123',
    title: 'Test Book',
    authors: [{ name: 'Author A' }],
    formats: { 'image/jpeg': 'https://example.com/image.jpg' },
};

describe('BookCard', () => {
    it('показывает название и автора', () => {
        render(<BookCard book={book} />);
        expect(screen.getByText(/Test Book/i)).toBeInTheDocument();
        expect(screen.getByText(/Author A/i)).toBeInTheDocument();
    });
});
