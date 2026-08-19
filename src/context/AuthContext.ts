import { createContext } from 'react';
import type { User, SignUpData } from '../types';

export interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    signIn: (credentials: { email: string; password: string }) => Promise<void>;
    signUp: (data: SignUpData) => Promise<void>;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);