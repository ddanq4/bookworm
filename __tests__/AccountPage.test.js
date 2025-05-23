import { render, screen, act } from '@testing-library/react';
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

jest.mock('@/firebase/firebaseConfig', () => ({
    auth: {
        currentUser: { uid: '123' },
        onAuthStateChanged: (cb) => cb({ uid: '123' }),
    },
    db: {},
}));

jest.mock('firebase/firestore', () => ({
    doc: () => ({}),
    getDoc: () => Promise.resolve({ exists: () => false }),
}));

describe('AccountPage', () => {
    it('отображает поле имени пользователя', async () => {
        await act(async () => {
            render(<AccountPage />);
        });
        expect(await screen.findByPlaceholderText(/Ваше ім’я/i)).toBeInTheDocument();
    });
});