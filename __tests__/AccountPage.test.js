import { render, screen } from '@testing-library/react';
import AccountPage from '@/pages/account';
import React from 'react';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    }),
}));

describe('AccountPage', () => {
    it('отображает поле имени пользователя', () => {
        render(<AccountPage />);
        expect(screen.getByPlaceholderText(/Ваше ім’я/i)).toBeInTheDocument();
    });
});
