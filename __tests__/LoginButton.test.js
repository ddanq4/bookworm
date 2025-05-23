import { render, screen, fireEvent } from '@testing-library/react';
import LoginButton from '@/components/LoginButton';
import * as auth from '@/firebase/auth';
import React from 'react';

// Мокаем auth
jest.mock('@/firebase/auth', () => ({
    loginWithGoogle: jest.fn(),
    logout: jest.fn()
}));

// Мокаем next/router
jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    }),
}));

describe('LoginButton', () => {
    it('открывает попап и показывает "Увійти через Google"', () => {
        render(<LoginButton />);
        fireEvent.click(screen.getByRole('button')); // клик по иконке или кнопке входа
        expect(screen.getByText(/Увійти через Google/i)).toBeInTheDocument();
    });

    it('вызывает loginWithGoogle при клике', () => {
        render(<LoginButton />);
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText(/Увійти через Google/i));
        expect(auth.loginWithGoogle).toHaveBeenCalled();
    });
});
