import { render, screen } from '@testing-library/react';
import ReaderPage from '@/pages/reader';
import React from 'react';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    }),
}));

describe('ReaderPage', () => {
    it('отображает панель управления', () => {
        render(<ReaderPage />);
        expect(screen.getByRole('button', { name: /Збільшити шрифт/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Зменшити шрифт/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Повернутися до бібліотеки/i })).toBeInTheDocument();
    });
});
