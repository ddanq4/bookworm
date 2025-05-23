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

jest.mock('@/firebase/firebaseConfig', () => {
    const originalModule = jest.requireActual('@/firebase/firebaseConfig');
    return {
        ...originalModule,
        auth: {
            currentUser: { uid: '123' },
            onAuthStateChanged: (cb) => cb({ uid: '123' }),
        }
    };
});

describe('AccountPage', () => {
    it('отображает поле имени пользователя', async () => {
        render(<AccountPage />);
        expect(await screen.findByPlaceholderText(/Ваше ім’я/i)).toBeInTheDocument();
    });
});
