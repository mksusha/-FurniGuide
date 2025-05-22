'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Author = {
    id: string;
    name: string;
    slug: string;
};

type SortOption = 'nameAsc' | 'nameDesc';

export default function AuthorListPage() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('nameAsc');
    const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);
    const router = useRouter();

    const loadAuthors = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/authors');
            if (!res.ok) throw new Error('Ошибка загрузки авторов');
            const data = await res.json();
            setAuthors(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuthors();
    }, []);

    const confirmDelete = async () => {
        if (!authorToDelete) return;
        try {
            const res = await fetch(`/api/admin/authors/${authorToDelete.slug}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setAuthors((prev) =>
                    prev.filter((a) => a.slug !== authorToDelete.slug)
                );
                setAuthorToDelete(null);
            } else {
                setError('Ошибка при удалении');
            }
        } catch {
            setError('Ошибка при удалении');
        }
    };

    const filteredAuthors = authors
        .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) =>
            sortBy === 'nameAsc'
                ? a.name.localeCompare(b.name, 'ru')
                : b.name.localeCompare(a.name, 'ru')
        );

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Поиск по имени"
                    className="border border-indigo-600/50 rounded-lg px-4 py-2 w-full sm:max-w-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="border border-indigo-600/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition w-full sm:w-auto"
                >
                    <option value="nameAsc">По имени: А→Я</option>
                    <option value="nameDesc">По имени: Я→А</option>
                </select>

                <button
                    onClick={() => router.push('/admin/authors/create')}
                    className="w-full sm:w-auto px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                    + Добавить автора
                </button>
            </div>

            {loading && (
                <p className="text-center text-indigo-600 font-semibold">Загрузка...</p>
            )}

            {error && (
                <p className="mb-6 text-center text-red-600 font-semibold">{error}</p>
            )}

            <ul className="space-y-3">
                {filteredAuthors.length === 0 && !loading && (
                    <p className="text-center text-gray-500 mt-6">Авторы не найдены</p>
                )}

                {filteredAuthors.map((author) => (
                    <li
                        key={author.id}
                        className="border border-indigo-600/50 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="font-semibold text-lg text-black">{author.name}</div>
                        <div className="flex gap-6 items-center">
                            <button
                                onClick={() => router.push(`/admin/authors/${author.slug}/edit`)}
                                className="text-black hover:text-indigo-600 font-medium transition"
                            >
                                Редактировать
                            </button>
                            <button
                                onClick={() => setAuthorToDelete(author)}
                                className="text-red-600 hover:text-red-700 font-semibold transition"
                            >
                                Удалить
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Модалка удаления */}
            {authorToDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4">
                        <h2 className="text-lg font-bold">
                            Удалить автора «{authorToDelete.name}»?
                        </h2>
                        <p className="text-sm text-gray-600">Это действие нельзя отменить.</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setAuthorToDelete(null)}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
