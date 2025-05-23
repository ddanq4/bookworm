import { render, screen } from '@testing-library/react';
import AccountPage from '@/pages/account';
import React from 'react';


describe('AccountPage', () => {
    it('отображает поле имени пользователя', () => {
        render(<AccountPage />);
        expect(screen.getByPlaceholderText(/Ваше ім’я/i)).toBeInTheDocument();
    });
});
