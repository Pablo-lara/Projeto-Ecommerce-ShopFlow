import { useState, type ReactNode } from 'react';
import type { User, AuthResponse, SignUpData } from '../types';
import { api } from '../services/api';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const storedToken = localStorage.getItem('shopflow_token');
            const storedUser = localStorage.getItem('shopflow_user');

            if (storedToken && storedUser) {
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                return JSON.parse(storedUser);
            }
        } catch (error) {
            console.error('Erro ao restaurar sessão:', error);
            localStorage.removeItem('shopflow_token');
            localStorage.removeItem('shopflow_user');
        }
        return null;
    });

    // Identifica admin por role da API OU por e-mail de administrador
    const isUserAdmin = Boolean(
        user &&
        (user.role?.toUpperCase().includes('ADMIN') ||
            user.email.toLowerCase() === 'admin@shopflow.com')
    );

    async function signIn(credentials: { email: string; password: string }) {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        const token = response.data.token;
        const userData = response.data.user || response.data;

        localStorage.setItem('shopflow_token', token);
        localStorage.setItem('shopflow_user', JSON.stringify(userData));

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    }

    async function signUp(data: SignUpData) {
        const response = await api.post<AuthResponse>('/auth/register', {
            name: data.name,
            email: data.email,
            password: data.password,
        });

        const token = response.data.token;
        const userData = response.data.user || response.data;

        localStorage.setItem('shopflow_token', token);
        localStorage.setItem('shopflow_user', JSON.stringify(userData));

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    }

    function signOut() {
        localStorage.removeItem('shopflow_token');
        localStorage.removeItem('shopflow_user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isAdmin: isUserAdmin,
                signIn,
                signUp,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}