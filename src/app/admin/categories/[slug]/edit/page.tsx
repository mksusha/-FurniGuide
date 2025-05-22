'use client';

import { use, useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Category = {
    id: string;
    name: string;
    slug: string;
};

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const { slug } = params as { slug: string };

    const [category, setCategory] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCategory() {
            try {
                const res = await fetch(`/api/admin/categories/${slug}`);
                if (!res.ok) throw new Error('Категория не найдена');
                const data = await res.json();
                setCategory(data);
                setName(data.name);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
        fetchCategory();
    }, [slug]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const res = await fetch(`/api/admin/categories/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Ошибка при обновлении');
            }

            router.push('/admin/categories');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-center text-gray-600 mt-10">Загрузка категории...</p>;
    if (error) return <p className="text-center text-red-600 mt-10 font-semibold">Ошибка: {error}</p>;
    if (!category) return <p className="text-center text-gray-600 mt-10">Категория не найдена</p>;

    return (
        <main className="max-w-xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Редактировать категорию</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                        Название категории
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                        autoFocus
                    />
                </div>

                {error && (
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className={`w-full py-2 rounded-md text-white font-semibold
                        ${saving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
                        transition`}
                >
                    {saving ? 'Сохраняю...' : 'Сохранить'}
                </button>
            </form>
        </main>
    );
}
