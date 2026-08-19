import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../services/api';
import type { Product } from '../types';
import { Package, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Order {
    id: number;
    total: number;
    createdAt: string;
    items: Array<{
        id: number;
        quantity: number;
        product: Product;
    }>;
}

interface AdminDashboardProps {
    onBackToStore: () => void;
}

export function AdminDashboard({ onBackToStore }: AdminDashboardProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

    // Estado do formulário de novo produto
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [resProducts, resOrders, resCategories] = await Promise.all([
                api.get<Product[]>('/Products'),
                api.get<Order[]>('/Products'),
                api.get<Category[]>('/Categories'),
            ]);
            setProducts(resProducts.data);
            setOrders(resOrders.data);
            setCategories(resCategories.data);

            if (resCategories.data.length > 0) {
                setCategoryId(resCategories.data[0].id);
            }
        } catch (err) {
            console.error('Erro ao carregar dados do admin:', err);
        }
    }

    async function handleCreateProduct(e: FormEvent) {
        e.preventDefault();

        if (!categoryId) {
            alert('Selecione uma categoria válida.');
            return;
        }

        setLoading(true);

        try {
            await api.post('/Products', {
                name,
                price: Number(price),
                description,
                categoryId: Number(categoryId), // Envia o ID numérico esperado pela DTO do C#
                imageUrl,
            });

            alert('Produto cadastrado com sucesso!');
            setName('');
            setPrice('');
            setDescription('');
            if (categories.length > 0) {
                setCategoryId(categories[0].id);
            }
            setImageUrl('');
            loadData();
        } catch (err) {
            console.error(err);
            alert('Erro ao cadastrar produto.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteProduct(id: string | number) {
        if (!confirm('Deseja realmente excluir este produto?')) return;

        try {
            await api.delete(`/Products/${id}`);

            // Converte ambos para String para evitar incompatibilidade entre string e number
            setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
        } catch (err) {
            console.error(err);
            alert('Erro ao excluir produto.');
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Cabeçalho Admin */}
                <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                        <p className="text-sm text-gray-500">Gerencie o catálogo de produtos e acompanhe os pedidos.</p>
                    </div>
                    <button
                        onClick={onBackToStore}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar para a Loja</span>
                    </button>
                </div>

                {/* NAVEGAÇÃO ENTRE ABAS */}
                <div className="flex gap-4 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'products'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Package className="w-4 h-4" />
                        <span>Produtos ({products.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'orders'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Pedidos Realizados ({orders.length})</span>
                    </button>
                </div>

                {/* ABA 1: PRODUTOS */}
                {activeTab === 'products' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Form de Cadastro */}
                        <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-xl shadow-sm border space-y-4 h-fit">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-blue-600" /> Cadastrar Produto
                            </h2>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Nome</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    placeholder="Nome do produto"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Preço (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    placeholder="99.90"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Categoria</label>
                                <select
                                    required
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(Number(e.target.value))}
                                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                                >
                                    <option value="" disabled>Selecione uma categoria</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">URL da Imagem</label>
                                <input
                                    type="url"
                                    required
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg text-sm h-20"
                                    placeholder="Descrição breve..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                            >
                                {loading ? 'Salvando...' : 'Salvar Produto'}
                            </button>
                        </form>

                        {/* Lista de Produtos Cadastrados */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Produtos no Catálogo</h2>

                            <div className="divide-y max-h-[600px] overflow-y-auto">
                                {products.map((product) => (
                                    <div key={product.id} className="py-3 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded-lg border"
                                            />
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                                                <p className="text-xs text-gray-500">R$ {product.price.toFixed(2)} - {product.category}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Excluir Produto"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ABA 2: PEDIDOS */}
                {activeTab === 'orders' && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                        <h2 className="text-lg font-bold text-gray-800">Histórico Geral de Pedidos</h2>

                        {orders.length === 0 ? (
                            <p className="text-sm text-gray-500">Nenhum pedido foi realizado ainda.</p>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-center border-b pb-2 mb-2 text-xs text-gray-600 font-semibold">
                                            <span>Pedido #{order.id}</span>
                                            <span>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <div className="space-y-1">
                                            {order.items?.map((item) => (
                                                <div key={item.id} className="flex justify-between text-xs text-gray-800">
                                                    <span>{item.quantity}x {item.product?.name}</span>
                                                    <span>R$ {(item.product?.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}