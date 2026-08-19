import { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './AuthModal';
import { api } from '../services/api';
import axios from 'axios';
import type { CartItem } from '../types';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    // Desestruturando 'cart' exatamente como está no seu CartContextData
    const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
    const { isAuthenticated } = useAuth();

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');

    if (!isOpen) return null;

    async function executeCheckout() {
        setIsSubmitting(true);
        setCheckoutError('');

        try {
            const itemsPayload = (cart || []).map((item: CartItem) => ({
                productId: item.product.id,
                quantity: item.quantity,
            }));

            await api.post('/Payment/create', { items: itemsPayload });

            alert('Pedido realizado com sucesso!');
            clearCart();
            onClose();
        } catch (err: unknown) {
            console.error('Erro ao finalizar pedido:', err);
            if (axios.isAxiosError(err)) {
                setCheckoutError(err.response?.data?.message || 'Erro ao processar o pedido na API.');
            } else {
                setCheckoutError('Ocorreu um erro ao finalizar o pedido.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleCheckout() {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }

        executeCheckout();
    }

    return (
        <>
            <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm">
                <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                    <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">

                        {/* Header do Drawer */}
                        <div className="p-6 border-b flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-gray-700" />
                                <h2 className="text-lg font-bold text-gray-900">Seu Carrinho</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Lista de Produtos */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {(!cart || cart.length === 0) ? (
                                <div className="text-center py-12 text-gray-500">
                                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="text-sm font-medium">Seu carrinho está vazio.</p>
                                </div>
                            ) : (
                                cart.map((item: CartItem) => (
                                    <div
                                        key={item.product.id}
                                        className="flex gap-4 p-3 border rounded-lg items-center bg-gray-50"
                                    >
                                        <img
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            className="w-16 h-16 object-cover rounded-md bg-white border"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-sm font-bold text-blue-600">
                                                R$ {item.product.price.toFixed(2)}
                                            </p>

                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(Number(item.product.id), item.quantity - 1)}
                                                    className="w-6 h-6 border rounded bg-white text-gray-600 hover:bg-gray-100 text-xs font-bold"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xs font-semibold px-1">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(Number(item.product.id), item.quantity + 1)}
                                                    className="w-6 h-6 border rounded bg-white text-gray-600 hover:bg-gray-100 text-xs font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(Number(item.product.id))}
                                            className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer do Drawer */}
                        {cart && cart.length > 0 && (
                            <div className="p-6 border-t bg-white space-y-4">
                                {checkoutError && (
                                    <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
                                        {checkoutError}
                                    </p>
                                )}

                                <div className="flex justify-between items-center text-base font-bold text-gray-900">
                                    <span>Total:</span>
                                    <span className="text-xl text-blue-600">R$ {totalPrice.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        'Processando...'
                                    ) : (
                                        <>
                                            <span>Finalizar Compra</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => {
                    executeCheckout();
                }}
            />
        </>
    );
}