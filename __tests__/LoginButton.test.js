import { render, screen, fireEvent } from '@testing-library/react';
import LoginButton from '@/components/LoginButton';
import * as auth from '@/firebase/auth';
import React from 'react';

jest.mock('@/firebase/auth', () => ({
    loginWithGoogle: jest.fn(),
    logout: jest.fn()
}));

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    }),
}));

describe('LoginButton', () => {
    beforeEach(() => {
        // Удалим предыдущие попапы
        document.body.innerHTML = '';
    });

    it('открывает попап и показывает "Увійти через Google"', () => {
        render(<LoginButton />);

        // клик по иконке входа
        fireEvent.click(screen.getByText(/Увійти/i));

        expect(screen.getByText(/Увійти через Google/i)).toBeInTheDocument();
    });

    it('вызывает loginWithGoogle при клике', () => {
        render(<LoginButton />);
        fireEvent.click(screen.getByText(/Увійти/i));
        fireEvent.click(screen.getByText(/Увійти через Google/i));
        expect(auth.loginWithGoogle).toHaveBeenCalled();
    });
});
