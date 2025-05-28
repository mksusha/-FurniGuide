'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

// Функция транслитерации
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/а/g, 'a')
        .replace(/б/g, 'b')
        .replace(/в/g, 'v')
        .replace(/г/g, 'g')
        .replace(/д/g, 'd')
        .replace(/е/g, 'e')
        .replace(/ё/g, 'e')
        .replace(/ж/g, 'zh')
        .replace(/з/g, 'z')
        .replace(/и/g, 'i')
        .replace(/й/g, 'y')
        .replace(/к/g, 'k')
        .replace(/л/g, 'l')
        .replace(/м/g, 'm')
        .replace(/н/g, 'n')
        .replace(/о/g, 'o')
        .replace(/п/g, 'p')
        .replace(/р/g, 'r')
        .replace(/с/g, 's')
        .replace(/т/g, 't')
        .replace(/у/g, 'u')
        .replace(/ф/g, 'f')
        .replace(/х/g, 'h')
        .replace(/ц/g, 'ts')
        .replace(/ч/g, 'ch')
        .replace(/ш/g, 'sh')
        .replace(/щ/g, 'sch')
        .replace(/ъ/g, '')
        .replace(/ы/g, 'y')
        .replace(/ь/g, '')
        .replace(/э/g, 'e')
        .replace(/ю/g, 'yu')
        .replace(/я/g, 'ya')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export default function CreateCategoryPage() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [slugEdited, setSlugEdited] = useState(false);
    const [metaTitleEdited, setMetaTitleEdited] = useState(false);
    const [metaDescriptionEdited, setMetaDescriptionEdited] = useState(false);

    const router = useRouter();

    // Автозаполнение slug и meta при изменении имени
    useEffect(() => {
        if (!slugEdited) {
            setSlug(slugify(name));
        }
        if (!metaTitleEdited) {
            setMetaTitle(name);
        }
        if (!metaDescriptionEdited) {
            setMetaDescription(`Категория: ${name}`);
        }
    }, [name]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    slug,
                    metaTitle,
                    metaDescription,
                }),
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
                    <label className="block text-sm font-medium mb-2">Название категории</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Например: Освещение"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Slug</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => {
                            setSlug(e.target.value);
                            setSlugEdited(true);
                        }}
                        placeholder="osveshchenie"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Meta Title</label>
                    <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => {
                            setMetaTitle(e.target.value);
                            setMetaTitleEdited(true);
                        }}
                        placeholder="SEO заголовок"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Meta Description</label>
                    <textarea
                        value={metaDescription}
                        onChange={(e) => {
                            setMetaDescription(e.target.value);
                            setMetaDescriptionEdited(true);
                        }}
                        placeholder="Краткое описание категории"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        rows={3}
                    />
                </div>

                {error && (
                    <div className="text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg w-full"
                >
                    {saving ? 'Сохраняю...' : 'Создать'}
                </button>
            </form>
        </div>
    );
}
