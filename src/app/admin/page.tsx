'use client';

import Link from 'next/link';

export default function AdminPage() {
    return (
        <div className="max-w-5xl mx-auto p-10 space-y-12 bg-white min-h-screen">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">
                Панель администратора
            </h1>

            <section className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-indigo-600/50">
                <h2 className="text-2xl font-semibold mb-5 text-indigo-600/50">
                    Посты
                </h2>
                <div className="flex flex-col gap-3">
                    {[
                        { href: "/admin/posts", label: "Просмотреть и редактировать посты" },
                        { href: "/admin/posts/create", label: "Добавить новый пост" },
                        { href: "/admin/posts/upload-json", label: "Загрузить посты через JSON" }
                    ].map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="block text-black hover:text-indigo-600/50 transition-colors duration-300"
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-indigo-600/50">
                <h2 className="text-2xl font-semibold mb-5 text-indigo-600/50">
                    Категории
                </h2>
                <div className="flex flex-col gap-3">
                    {[
                        { href: "/admin/categories", label: "Просмотреть и редактировать категории" },
                        { href: "/admin/categories/create", label: "Добавить новую категорию" },
                        { href: "/admin/categories/upload-json", label: "Загрузить категории через JSON" }
                    ].map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="block text-black hover:text-indigo-600/50 transition-colors duration-300"
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-indigo-600/50">
                <h2 className="text-2xl font-semibold mb-5 text-indigo-600/50">
                    Авторы
                </h2>
                <div className="flex flex-col gap-3">
                    {[
                        { href: "/admin/authors", label: "Просмотреть и редактировать авторов" },
                        { href: "/admin/authors/create", label: "Добавить нового автора" },
                        { href: "/admin/authors/upload-json", label: "Загрузить авторов через JSON" }
                    ].map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="block text-black hover:text-indigo-600/50 transition-colors duration-300"
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
