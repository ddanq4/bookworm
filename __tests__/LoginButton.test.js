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
        document.body.innerHTML = '';
    });

    it('открывает попап и показывает "Увійти через Google"', () => {
        render(<LoginButton />);
        fireEvent.click(screen.getAllByText(/Увійти/i)[0]); // безопасный клик
        expect(screen.getByText(/Увійти через Google/i)).toBeInTheDocument();
    });

    it('вызывает loginWithGoogle при клике', () => {
        render(<LoginButton />);
        fireEvent.click(screen.getAllByText(/Увійти/i)[0]);
        fireEvent.click(screen.getByText(/Увійти через Google/i));
        expect(auth.loginWithGoogle).toHaveBeenCalled();
    });
});
