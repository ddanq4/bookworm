import { render, screen, fireEvent } from '@testing-library/react';
import LoginButton from '@/components/LoginButton';
import * as auth from '@/firebase/auth';
import React from 'react';

// ✅ Мокаем Firebase auth
jest.mock('@/firebase/auth', () => ({
    loginWithGoogle: jest.fn(),
    logout: jest.fn()
}));

// ✅ Мокаем next/router
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
        jest.clearAllMocks();
    });

    it('открывает попап и показывает кнопку Google входа', () => {
        render(<LoginButton />);

        // Кликаем по кнопке "Увійти" или аналогичной (можно заменить на getByLabelText)
        fireEvent.click(screen.getAllByText(/Увійти/i)[0]);

        // Проверяем, что кнопка входа через Google отображается
        expect(screen.getByText(/Увійти через Google/i)).toBeInTheDocument();
    });

    it('вызывает loginWithGoogle при клике', () => {
        render(<LoginButton />);

        fireEvent.click(screen.getAllByText(/Увійти/i)[0]); // открыть попап
        fireEvent.click(screen.getByText(/Увійти через Google/i)); // клик по Google

        expect(auth.loginWithGoogle).toHaveBeenCalled();
    });
});
