import { render, screen, fireEvent } from '@testing-library/react';
import LoginButton from '@/components/LoginButton';
import * as auth from '@/firebase/auth';
import React from 'react';

// Мокаем модуль firebase/auth
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

// Мокаем React.useContext для имитации текущего пользователя
jest.mock('react', () => {
    const ActualReact = jest.requireActual('react');
    return {
        ...ActualReact,
        useContext: jest.fn(),
    };
});

describe('LoginButton', () => {
    it('показывает "Вийти", если пользователь залогинен', () => {
        require('react').useContext.mockReturnValue({ currentUser: { uid: '123' } });

        render(<LoginButton />);
        expect(screen.getByText(/Вийти/i)).toBeInTheDocument();
    });

    it('показывает "Увійти через Google", если пользователь не залогинен', () => {
        require('react').useContext.mockReturnValue({ currentUser: null });

        render(<LoginButton />);
        expect(screen.getByText(/Увійти через Google/i)).toBeInTheDocument();
    });

    it('вызов loginWithGoogle при клике', () => {
        require('react').useContext.mockReturnValue({ currentUser: null });

        render(<LoginButton />);
        fireEvent.click(screen.getByText(/Увійти через Google/i));
        expect(auth.loginWithGoogle).toHaveBeenCalled();
    });

    it('вызов logout при клике', () => {
        require('react').useContext.mockReturnValue({ currentUser: { uid: '123' } });

        render(<LoginButton />);
        fireEvent.click(screen.getByText(/Вийти/i));
        expect(auth.logout).toHaveBeenCalled();
    });
});
