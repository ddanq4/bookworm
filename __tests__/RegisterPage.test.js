import { render, screen } from '@testing-library/react';
import RegisterPage from '@/pages/auth/register';
import React from 'react';


describe('RegisterPage', () => {
    it('отображает поля и кнопку регистрации', () => {
        render(<RegisterPage />);
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Пароль/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Підтвердження пароля/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Зареєструватися/i })).toBeInTheDocument();
    });
});
