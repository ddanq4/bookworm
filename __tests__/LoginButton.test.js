import { render, screen } from '@testing-library/react';
import LoginButton from '@/components/LoginButton';
import { AuthContext } from '@/firebase/AuthProvider';

describe('LoginButton', () => {
    it('показывает "Вийти", если пользователь залогинен', () => {
        render(
            <AuthContext.Provider value={{ currentUser: { uid: '123' }, logout: jest.fn() }}>
                <LoginButton />
            </AuthContext.Provider>
        );
        expect(screen.getByText(/Вийти/i)).toBeInTheDocument();
    });

    it('показывает "Увійти через Google", если пользователь не залогинен', () => {
        render(
            <AuthContext.Provider value={{ currentUser: null, loginWithGoogle: jest.fn() }}>
                <LoginButton />
            </AuthContext.Provider>
        );
        expect(screen.getByText(/Увійти через Google/i)).toBeInTheDocument();
    });
});
