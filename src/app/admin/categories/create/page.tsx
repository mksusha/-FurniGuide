'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCategoryPage() {
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Ошибка при создании');
            }

            router.push('/admin/categories');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6 mt-10">
            <h1 className="text-3xl font-bold text-indigo-700">Создать категорию</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">
                        Название категории
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Например: Освещение"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"

                    />
                </div>

                {error && (
                    <div className="text-red-600 font-medium bg-red-50 p-3 rounded-md border border-red-200">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 w-full hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition"

                >
                    {saving ? 'Сохраняю...' : 'Создать'}
                </button>
            </form>
        </div>
    );
}
