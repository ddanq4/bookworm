import { render, screen } from '@testing-library/react';
import LibraryPage from '@/pages/library';
import React from 'react';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    }),
}));

describe('LibraryPage', () => {
    it('рендерит компонент без ошибок', () => {
        render(<LibraryPage />);
        expect(screen.getByPlaceholderText(/Пошук книг/i)).toBeInTheDocument();
    });
});
