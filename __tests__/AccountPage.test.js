import { render, screen } from '@testing-library/react';
import AccountPage from '@/pages/account';

describe('AccountPage', () => {
    it('отображает поле имени пользователя', () => {
        render(<AccountPage />);
        expect(screen.getByPlaceholderText(/Ваше ім’я/i)).toBeInTheDocument();
    });
});
