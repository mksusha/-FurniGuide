'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAuthorPage() {
    const [name, setName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [bio, setBio] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const toSlug = (str: string) =>
        str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

    const handleSubmit = async () => {
        setError('');
        if (!name.trim()) return setError('Введите имя автора');
        if (avatarUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(avatarUrl)) {
            return setError('Некорректная ссылка на изображение');
        }

        const slug = toSlug(name);

        const res = await fetch('/api/admin/authors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, slug, avatarUrl, bio }),
        });

        if (res.ok) {
            router.push('/admin/authors');
        } else {
            const data = await res.json();
            setError(data?.error || 'Ошибка при создании');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6 mt-10">
            <h1 className="text-3xl font-bold text-indigo-700">Создание автора</h1>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Имя автора *
                    </label>
                    <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Иван Иванов"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ссылка на аватар
                    </label>
                    <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="https://example.com/avatar.jpg"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Биография
                    </label>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Краткая информация об авторе"
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="text-red-600 font-medium text-sm">{error}</div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-indigo-600 w-full hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition"
                    >
                        Создать автора
                    </button>
                </div>
            </div>
        </div>
    );
}
