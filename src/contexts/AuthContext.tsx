'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, User } from '@/lib/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    refreshUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const currentUser = await AuthService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Erro ao carregar usuário no contexto:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('AuthContext: Initializing...');

        // Apenas escutar mudanças de autenticação
        // O onAuthStateChange dispara imediatamente com a sessão atual
        const { data: { subscription } } = AuthService.onAuthStateChange((newUser) => {
            console.log('AuthContext: User updated', newUser?.id);
            setUser(newUser);
            setLoading(false);
        });

        return () => {
            console.log('AuthContext: Cleaning up...');
            subscription.unsubscribe();
        };
    }, []);

    const refreshUser = async () => {
        await loadUser();
    };

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}
