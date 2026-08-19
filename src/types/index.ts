export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface SignUpData {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    category?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}