'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Ошибка входа');
                setLoading(false);
                return;
            }

            router.push('/admin/protected');
        } catch {
            setError('Ошибка сети');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-md mx-auto mt-24 p-8 bg-white rounded-2xl shadow-lg ring-1 ring-gray-200">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">Вход в админ-панель</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                        Логин
                    </label>
                    <div className="relative">
                        <input
                            id="username"
                            type="text"
                            placeholder="Введите логин"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="peer w-full rounded-md border border-gray-300 px-4 py-3 pl-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                        <svg
                            className="w-5 h-5 absolute left-3 top-3.5 text-indigo-400 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.878 6.196 9 9 0 015.12 17.804z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                        Пароль
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="peer w-full rounded-md border border-gray-300 px-4 py-3 pl-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                        <svg
                            className="w-5 h-5 absolute left-3 top-3.5 text-indigo-400 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 11c1.38 0 2.5 1.12 2.5 2.5S13.38 16 12 16s-2.5-1.12-2.5-2.5S10.62 11 12 11z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.5 11V7a5.5 5.5 0 00-11 0v4"
                            />
                            <rect width="14" height="8" x="5" y="11" rx="2" ry="2" stroke="none" />
                        </svg>
                    </div>
                </div>

                {error && <p className="text-red-600 text-center text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? 'Вхожу...' : 'Войти'}
                </button>
            </form>
        </main>
    );
}
