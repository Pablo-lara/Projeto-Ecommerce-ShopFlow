import { useState } from 'react';
import { ShoppingBag, User as UserIcon, LogOut, ShieldCheck } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './AuthModal';

interface HeaderProps {
    onOpenCart: () => void;
}

export function Header({ onOpenCart }: HeaderProps) {
    const { totalItems } = useCart();
    const { user, isAuthenticated, isAdmin, signOut } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <>
            <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Logo e Badge de Admin */}
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">ShopFlow</h1>
                        {isAuthenticated && isAdmin && (
                            <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 border border-purple-200">
                                <ShieldCheck className="w-3.5 h-3.5" /> Admin
                            </span>
                        )}
                    </div>

                    {/* Área Direita: Perfil de Usuário / Login e Carrinho */}
                    

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-3 py-1.5">
                                <div className="flex flex-col text-right">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                        Logado como
                                    </span>
                                    <span className="text-xs font-bold text-gray-800 line-clamp-1 max-w-[120px]">
                                        {user.name || user.email || 'Usuário'}
                                    </span>
                                </div>

                                <button
                                    onClick={signOut}
                                    title="Sair da conta"
                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3.5 py-2 rounded-lg transition-colors"
                            >
                                <UserIcon className="w-4 h-4" />
                                <span>Entrar / Criar Conta</span>
                            </button>
                        )}

                        {/* Ícone do Carrinho */}
                        <button
                            onClick={onOpenCart}
                            className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                            title="Abrir carrinho"
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Modal de Login/Cadastro acionada pelo botão do Header */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
}