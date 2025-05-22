'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Post = {
    id: string;
    title: string;
    slug: string;
    createdAt: string;
};

type SortOption = 'dateDesc' | 'dateAsc' | 'alphaAsc' | 'alphaDesc';

export default function PostListPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Сортировка
    const [sortBy, setSortBy] = useState<SortOption>('dateDesc');

    // Модалка удаления
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const loadPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/posts');
            if (!res.ok) throw new Error('Ошибка загрузки постов');
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const openDeleteModal = (post: Post) => {
        setPostToDelete(post);
        setDeleteError(null);
    };

    const closeDeleteModal = () => {
        if (deleteLoading) return;
        setPostToDelete(null);
        setDeleteError(null);
    };

    const handleDelete = async () => {
        if (!postToDelete) return;
        setDeleteLoading(true);
        setDeleteError(null);
        try {
            const res = await fetch(`/api/admin/posts/${postToDelete.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                const text = await res.text();
                setDeleteError('Ошибка при удалении: ' + text);
                setDeleteLoading(false);
                return;
            }
            setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
            closeDeleteModal();
        } catch (err) {
            setDeleteError('Ошибка при удалении: ' + (err as Error).message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    // Сортируем по выбранному критерию
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        switch (sortBy) {
            case 'dateAsc':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'dateDesc':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'alphaAsc':
                return a.title.localeCompare(b.title, 'ru');
            case 'alphaDesc':
                return b.title.localeCompare(a.title, 'ru');
            default:
                return 0;
        }
    });

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <input
                    type="text"
                    placeholder="Поиск по названию"
                    className="border border-indigo-600/50 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="border border-indigo-600/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition max-w-xs"
                >
                    <option value="dateDesc">Дата: новые сверху</option>
                    <option value="dateAsc">Дата: старые сверху</option>
                    <option value="alphaAsc">По алфавиту: А→Я</option>
                    <option value="alphaDesc">По алфавиту: Я→А</option>
                </select>
                <Link
                    href="/admin/posts/create"
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
                {sortedPosts.map((post) => (
                    <li
                        key={post.id}
                        className="border border-indigo-600/50 rounded-xl p-4 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div>
                            <div className="font-semibold text-black text-lg">
                                {post.title}
                            </div>
                            <div className="text-sm text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="flex gap-6 items-center">
                            <Link
                                href={`/admin/posts/${post.id}/edit`}
                                className="text-black hover:text-indigo-600/50 font-medium transition-colors duration-300"
                            >
                                Редактировать
                            </Link>
                            <button
                                onClick={() => openDeleteModal(post)}
                                className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-300"
                            >
                                Удалить
                            </button>
                        </div>
                    </li>
                ))}
                {sortedPosts.length === 0 && !loading && (
                    <p className="text-center text-gray-500 mt-6">Посты не найдены</p>
                )}
            </ul>

            {/* Модальное окно */}
            {postToDelete && (
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
                            Вы действительно хотите удалить пост &quot;
                            <strong>{postToDelete.title}</strong>&quot;?
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
