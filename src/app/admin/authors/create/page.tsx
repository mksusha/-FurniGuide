'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapEditor from '@/app/admin/components/TiptapEditor'; // Импортируй твой компонент редактора правильно
import '@/app/admin/tiptap-editor.css';

export default function CreateAuthorPage() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    // TipTap редактор для биографии
    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
        onUpdate({ editor }) {
            setBio(editor.getHTML());
        },
    });

    const [bio, setBio] = useState('');

    // Функция для генерации слага, поддерживает русский текст (транслитерация)
    const toSlug = (str: string) => {
        const ru = 'абвгдеёжзийклмнопрстуфхцчшщьыэюя';
        const en = ['a','b','v','g','d','e','yo','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','ts','ch','sh','sch','','y','','e','yu','ya'];

        str = str.toLowerCase();

        let res = '';
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const index = ru.indexOf(char);
            if (index >= 0) {
                res += en[index];
            } else if (/[a-z0-9]/.test(char)) {
                res += char;
            } else {
                res += '-';
            }
        }
        // Убираем множественные дефисы и по краям
        res = res.replace(/-+/g, '-').replace(/(^-|-$)/g, '');
        return res;
    };

    // Автоматически обновляем слаг при изменении имени, но не затираем, если пользователь редактировал сам
    useEffect(() => {
        // Если slug пустой или совпадает с предыдущим слагом от имени — обновляем
        const generatedSlug = toSlug(name);
        if (!slug || slug === toSlug(slug)) {
            setSlug(generatedSlug);
        }
    }, [name]);

    // Загрузка файла аватара
    const [uploading, setUploading] = useState(false);
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                setError('Ошибка загрузки изображения');
                return;
            }

            const data = await res.json();

            if (data.url) {
                setAvatarUrl(data.url);
            } else {
                setError('Не удалось получить ссылку на изображение.');
            }
        } catch {
            setError('Ошибка загрузки изображения. Попробуйте позже.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        setError('');
        if (!name.trim()) return setError('Введите имя автора');
        if (!slug.trim()) return setError('Введите slug');
        if (avatarUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/i.test(avatarUrl)) {
            return setError('Некорректная ссылка на изображение');
        }


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
                        Slug *
                    </label>
                    <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="ivan-ivanov"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
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
                    {avatarUrl && (
                        <img
                            src={avatarUrl}
                            alt="Аватар превью"
                            className="mt-2 max-h-40 rounded-lg object-contain"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Или загрузите аватар с устройства
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        disabled={uploading}
                    />
                    {uploading && <p className="text-sm text-gray-500 mt-1">Загрузка...</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Биография
                    </label>
                    <div className="border border-gray-300 rounded-lg px-3 py-2 min-h-[150px]">
                        <TiptapEditor editor={editor} />
                    </div>
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
