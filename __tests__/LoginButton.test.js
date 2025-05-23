import { render, screen, fireEvent } from '@testing-library/react';
import LoginPopup from '@/components/LoginButton'; // это твой LoginPopup
import * as auth from '@/firebase/auth';
import React from 'react';

jest.mock('@/firebase/auth', () => ({
    loginWithGoogle: jest.fn(),
    logout: jest.fn(),
}));

describe('LoginPopup (LoginButton)', () => {
    it('вызывает loginWithGoogle при клике', () => {
        render(<LoginPopup onClose={() => {}} />);
        fireEvent.click(screen.getByText(/Увійти через Google/i));
        expect(auth.loginWithGoogle).toHaveBeenCalled();
    });
});
