'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        isGM: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'isGM' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    isGM: formData.isGM,
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                // Mostrar mensagem de sucesso
                if (data.needsConfirmation) {
                    setError(`✅ ${data.message}`);
                    setTimeout(() => {
                        router.push('/login?message=' + encodeURIComponent(data.message));
                    }, 3000);
                } else {
                    router.push('/login?message=' + encodeURIComponent(data.message || 'Conta criada com sucesso'));
                }
            } else {
                // Mostrar erro específico
                setError(data.error || 'Erro ao criar conta');
                console.error('Erro no registro:', data);
            }
        } catch (error: any) {
            console.error('Erro ao criar conta:', error);
            setError(error.message || 'Erro ao criar conta. Verifique sua conexão e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-orange-200">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-orange-600 mb-2">
                            🥷 Criar Conta
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Registre-se para começar a jogar
                        </p>
                    </div>

                    {error && (
                        <div className={`px-4 py-3 rounded-lg mb-4 ${
                            error.startsWith('✅') 
                                ? 'bg-green-100 border border-green-400 text-green-700' 
                                : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nome
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Digite seu nome"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Digite seu email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Digite sua senha"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar Senha
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Confirme sua senha"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="isGM"
                                name="isGM"
                                type="checkbox"
                                checked={formData.isGM}
                                onChange={handleChange}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isGM" className="ml-2 block text-sm text-gray-700">
                                Sou um Game Master
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg"
                        >
                            {loading ? 'Criando conta...' : 'Criar Conta'}
                        </button>

                        <div className="text-center">
                            <Link 
                                href="/login" 
                                className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                            >
                                Já tem uma conta? Faça login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
