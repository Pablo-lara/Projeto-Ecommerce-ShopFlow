import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { api } from '../services/api';
import { X, CheckCircle, QrCode, Copy } from 'lucide-react';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
    const { cart, totalPrice, clearCart } = useCart();
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [pixCode, setPixCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    async function handleCreateOrder(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            // Ajuste o endpoint conforme a rota do seu backend .NET
            const response = await api.post('/Payment/create', {
                customerName,
                customerEmail,
                items: cart.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    unitPrice: item.product.price,
                })),
                totalAmount: totalPrice,
            });

            // Simulação do payload do PIX retornado do backend
            setPixCode(response.data.pixCopiaECola || '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913ShopFlow API6009Sao Paulo62070503***6304E2CA');
            clearCart();
        } catch (error) {
            console.error('Erro ao gerar pedido:', error);
            alert('Erro ao processar o checkout. Verifique o console ou a API.');
        } finally {
            setLoading(false);
        }
    }

    function handleCopyPix() {
        if (pixCode) {
            navigator.clipboard.writeText(pixCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-900">Finalizar Compra</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                    {!pixCode ? (
                        <form onSubmit={handleCreateOrder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Ex: Pablo Silva"
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail para confirmação</label>
                                <input
                                    type="email"
                                    required
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    placeholder="pablo@email.com"
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg space-y-2 border">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Itens no pedido:</span>
                                    <span>{cart.length} produto(s)</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-2">
                                    <span>Total a pagar:</span>
                                    <span className="text-blue-600">R$ {totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Gerando Pagamento...' : 'Gerar Pagamento via PIX'}
                            </button>
                        </form>
                    ) : (
                        /* Tela do QR Code PIX */
                        <div className="text-center space-y-4">
                            <div className="flex justify-center text-green-500">
                                <CheckCircle className="w-12 h-12" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Pedido Gerado com Sucesso!</h3>
                            <p className="text-sm text-gray-500">Escaneie o QR Code abaixo no app do seu banco para pagar:</p>

                            <div className="flex justify-center my-4">
                                <div className="p-4 bg-gray-100 rounded-lg border">
                                    <QrCode className="w-40 h-40 text-gray-800" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={handleCopyPix}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-100 border text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                    {copied ? 'Código Copiado!' : 'Copiar PIX Copia e Cola'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}