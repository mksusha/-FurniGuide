'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Category = {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
};

type SortOption = 'alphaAsc' | 'alphaDesc';

export default function CategoryListPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Сортировка по алфавиту
    const [sortBy, setSortBy] = useState<SortOption>('alphaAsc');

    // Модальное окно удаления
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const loadCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/categories');
            if (!res.ok) throw new Error('Ошибка загрузки категорий');
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const openDeleteModal = (category: Category) => {
        setCategoryToDelete(category);
        setDeleteError(null);
    };

    const closeDeleteModal = () => {
        if (deleteLoading) return;
        setCategoryToDelete(null);
        setDeleteError(null);
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;
        setDeleteLoading(true);
        setDeleteError(null);
        try {
            const res = await fetch(`/api/admin/categories/by-id/${categoryToDelete.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                const text = await res.text();
                setDeleteError('Ошибка при удалении: ' + text);
                setDeleteLoading(false);
                return;
            }
            setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
            closeDeleteModal();
        } catch (err) {
            setDeleteError('Ошибка при удалении: ' + (err as Error).message);
        } finally {
            setDeleteLoading(false);
        }
    };

    // Фильтрация по поиску
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    // Сортировка по алфавиту
    const sortedCategories = [...filteredCategories].sort((a, b) => {
        switch (sortBy) {
            case 'alphaAsc':
                return a.name.localeCompare(b.name, 'ru');
            case 'alphaDesc':
                return b.name.localeCompare(a.name, 'ru');
            default:
                return 0;
        }
    });

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <input
                    type="text"
                    placeholder="Поиск по названию категории"
                    className="border border-indigo-600/50 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="border border-indigo-600/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition max-w-xs"
                >
                    <option value="alphaAsc">По алфавиту: А→Я</option>
                    <option value="alphaDesc">По алфавиту: Я→А</option>
                </select>
                <Link
                    href="/admin/categories/create"
                    className="inline-block px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                    + Добавить
                </Link>
            </div>

            {loading && (
                <p className="text-center text-indigo-600 font-semibold">Загрузка...</p>
            )}
            {error && (
                <p className="mb-6 text-center text-red-600 font-semibold">{error}</p>
            )}

            <ul className="space-y-3">
                {sortedCategories.map((category) => (
                    <li
                        key={category.id}
                        className="border border-indigo-600/50 rounded-xl p-4 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div>
                            <div className="font-semibold text-black text-lg">{category.name}</div>
                        </div>

                        <div className="flex gap-6 items-center">
                            <Link
                                href={`/admin/categories/${category.slug}/edit`}
                                className="text-black hover:text-indigo-600/50 font-medium transition-colors duration-300"
                            >
                                Редактировать
                            </Link>
                            <button
                                onClick={() => openDeleteModal(category)}
                                className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-300"
                            >
                                Удалить
                            </button>
                        </div>
                    </li>
                ))}
                {sortedCategories.length === 0 && !loading && (
                    <p className="text-center text-gray-500 mt-6">Категории не найдены</p>
                )}
            </ul>

            {/* Модальное окно */}
            {categoryToDelete && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeDeleteModal}
                >
                    <div
                        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold mb-4 text-indigo-600/50">
                            Подтвердите удаление
                        </h3>
                        <p className="mb-4 text-gray-700">
                            Вы действительно хотите удалить категорию &quot;
                            <strong>{categoryToDelete.name}</strong>&quot;?
                        </p>
                        {deleteError && (
                            <p className="text-red-600 mb-4 font-semibold">{deleteError}</p>
                        )}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeDeleteModal}
                                disabled={deleteLoading}
                                className="px-4 py-2 rounded-lg border border-indigo-600/50 hover:bg-indigo-50 transition disabled:opacity-50"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {deleteLoading ? 'Удаление...' : 'Удалить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
