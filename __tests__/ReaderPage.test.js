import { render, screen } from '@testing-library/react';
import ReaderPage from '@/pages/reader';
import React from 'react';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/',
        query: {
            url: 'https://example.com/book.txt',
            title: 'Test Book',
            id: '123',
        },
        asPath: '/',
    }),
}));

describe('ReaderPage', () => {
    it('отображает панель управления', async () => {
        render(<ReaderPage />);
        // ждём пока загрузится книга
        expect(await screen.findByRole('button', { name: /Збільшити шрифт/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Зменшити шрифт/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Повернутися до бібліотеки/i })).toBeInTheDocument();
    });
});
