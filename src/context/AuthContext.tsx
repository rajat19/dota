// Auth Context - Provides authentication state throughout the app
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from '../firebase/auth';
import { getUserProfile } from '../firebase/firestore';
import type { UserProfile } from '../types';

interface AuthContextValue {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    isAuthenticated: boolean;
    userId: string | null;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser: User | null) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch user profile from Firestore
                const profile = await getUserProfile(firebaseUser.uid);
                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value: AuthContextValue = {
        user,
        userProfile,
        loading,
        isAuthenticated: !!user,
        userId: user?.uid || null
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
