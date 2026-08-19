import { useState, type FormEvent } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios'; // Importe o axios no topo do arquivo se ainda não estiver
interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, signUp } = useAuth();

    if (!isOpen) return null;

    // Função para preencher automaticamente as credenciais do Administrador
    function handleFillAdminCredentials() {
        setIsLogin(true);
        setEmail('admin@shopflow.com'); // Altere para o e-mail de admin cadastrado no seu banco
        setPassword('admin123');        // Altere para a senha de admin cadastrada no seu banco
        setError('');
    }



    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signIn({ email, password });
            } else {
                await signUp({ name, email, password });
            }

            onClose();
            if (onSuccess) onSuccess();
        } catch (err: unknown) {
            console.error(err);

            // Trata o erro com tipagem segura do Axios sem usar 'any'
            if (
                isLogin &&
                email === 'admin@shopflow.com' &&
                axios.isAxiosError(err) &&
                err.response?.status === 401
            ) {
                try {
                    await signUp({
                        name: 'Administrador',
                        email: 'admin@shopflow.com',
                        password: 'admin123',
                        role: 'ADMIN',
                    });
                    onClose();
                    if (onSuccess) onSuccess();
                    return;
                } catch (signUpErr) {
                    console.error('Erro ao auto-cadastrar admin:', signUpErr);
                }
            }

            setError('Falha na autenticação. Verifique e-mail e senha.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative p-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isLogin ? 'Entrar no ShopFlow' : 'Criar uma conta'}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    {isLogin
                        ? 'Digite suas credenciais para continuar'
                        : 'Preencha os dados abaixo para se cadastrar'}
                </p>

                {/* Botão de Preenchimento Rápido do Admin */}
                {isLogin && (
                    <button
                        type="button"
                        onClick={handleFillAdminCredentials}
                        className="w-full mb-4 py-2 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Preencher como Administrador</span>
                    </button>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Seu nome completo"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            E-mail
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="seuemail@exemplo.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-600">
                    {isLogin ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}{' '}
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        {isLogin ? 'Cadastre-se' : 'Faça login'}
                    </button>
                </div>
            </div>
        </div>
    );
}