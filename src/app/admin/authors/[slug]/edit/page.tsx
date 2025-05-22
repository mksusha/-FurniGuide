'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Author = {
    id: string;
    name: string;
    slug: string;
    bio?: string;
    avatarUrl?: string;
};

export default function EditAuthorPage() {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();

    const [author, setAuthor] = useState<Author | null>(null);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAuthor = async () => {
            const res = await fetch(`/api/admin/authors/${slug}`);
            if (res.ok) {
                const data = await res.json();
                setAuthor(data);
                setName(data.name);
                setBio(data.bio || '');
                setAvatarUrl(data.avatarUrl || '');
            } else {
                setError('Автор не найден');
            }
        };

        fetchAuthor();
    }, [slug]);

    const toSlug = (str: string) =>
        str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

    const handleSave = async () => {
        if (!name.trim()) return setError('Введите имя');
        if (!author) return;

        const newSlug = toSlug(name);

        const res = await fetch(`/api/admin/authors/${author.slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                slug: newSlug,
                bio: bio.trim(),
                avatarUrl: avatarUrl.trim() || null,
            }),
        });

        if (res.ok) {
            router.push('/admin/authors');
        } else {
            let data;
            try {
                data = await res.json();
            } catch {
                data = {};
            }
            setError(data?.error || 'Ошибка при обновлении');
        }
    };

    const handleDelete = async () => {
        if (!author || !confirm('Удалить автора?')) return;

        const res = await fetch(`/api/admin/authors/${author.slug}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            router.push('/admin/authors');
        } else {
            setError('Не удалось удалить автора');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Редактирование автора</h1>

            {error && (
                <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <input
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Имя автора"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Биография"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

                <input
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="URL аватара"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                />

                {avatarUrl && (
                    <img
                        src={avatarUrl}
                        alt="Аватар автора"
                        className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow"
                    />
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                    onClick={handleSave}
                    className="w-full sm:w-auto px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                    Сохранить
                </button>
                <button
                    onClick={handleDelete}
                    className="w-full sm:w-auto px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
                >
                    Удалить
                </button>
            </div>
        </div>
    );
}
