import { useEffect, useState } from 'react';
import { api } from './services/api';
import type { Product } from './types';
import { useCart } from './hooks/useCart';
import { useAuth } from './hooks/useAuth';
import { CartDrawer } from './components/CartDrawer';
import { Header } from './components/Header';
import { AdminDashboard } from './pages/AdminDashboard';

export function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [viewAdmin, setViewAdmin] = useState(false);

    const { addToCart } = useCart();
    const { isAdmin } = useAuth();

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await api.get<Product[]>('/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    // Se o usuário clicar em alternar para Admin e for Admin
    if (viewAdmin && isAdmin) {
        return <AdminDashboard onBackToStore={() => setViewAdmin(false)} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Header onOpenCart={() => setIsCartOpen(true)} />

            {/* Botão de Atalho para Admin caso o usuário seja Admin */}
            {isAdmin && (
                <div className="bg-purple-600 text-white px-4 py-2 text-center text-xs font-bold flex justify-center items-center gap-2">
                    <span>Você está conectado como Administrador.</span>
                    <button
                        onClick={() => setViewAdmin(true)}
                        className="underline hover:text-purple-200 transition-colors"
                    >
                        Acessar Painel de Controle
                    </button>
                </div>
            )}

            {/* Catálogo de Produtos */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-xl font-semibold mb-6">Produtos em Destaque</h2>

                {loading ? (
                    <p className="text-gray-500">Carregando catálogo...</p>
                ) : products.length === 0 ? (
                    <p className="text-gray-500">Nenhum produto cadastrado no banco de dados.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={product.imageUrl || 'https://via.placeholder.com/300'}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <span className="text-xs text-blue-600 font-medium tracking-wide uppercase">
                                        {product.category}
                                    </span>
                                    <h3 className="font-semibold text-lg text-gray-900 mt-1 line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xl font-bold text-gray-900">
                                            R$ {product.price.toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </div>
    );
}

export default App;