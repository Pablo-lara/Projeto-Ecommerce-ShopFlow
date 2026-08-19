import { createContext } from 'react';
import type { Product, CartItem } from '../types';

export interface CartContextData {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

export const CartContext = createContext<CartContextData>({} as CartContextData);