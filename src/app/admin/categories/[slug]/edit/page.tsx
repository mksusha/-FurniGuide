'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Category = {
    id: string;
    name: string;
    slug: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
};

function slugify(text: string): string {
    const transliterated = text
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
        .replace(/я/g, 'ya');

    return transliterated
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const { slug } = params as { slug: string };

    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState('');
    const [slugValue, setSlugValue] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');

    // Флаги, отслеживающие было ли ручное редактирование полей
    const [slugEdited, setSlugEdited] = useState(false);
    const [metaTitleEdited, setMetaTitleEdited] = useState(false);
    const [metaDescriptionEdited, setMetaDescriptionEdited] = useState(false);

    useEffect(() => {
        async function fetchCategory() {
            try {
                const res = await fetch(`/api/admin/categories/${slug}`);
                if (!res.ok) throw new Error('Категория не найдена');
                const data = await res.json();
                setCategory(data);
                setName(data.name);
                setSlugValue(data.slug || '');
                setMetaTitle(data.metaTitle || '');
                setMetaDescription(data.metaDescription || '');
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
        fetchCategory();
    }, [slug]);

    // Автообновление slug, metaTitle, metaDescription при изменении name
    useEffect(() => {
        if (!slugEdited) {
            setSlugValue(slugify(name));
        }
        if (!metaTitleEdited) {
            setMetaTitle(name);
        }
        if (!metaDescriptionEdited) {
            setMetaDescription(`Статьи и материалы по категории: ${name}`);
        }
    }, [name, slugEdited, metaTitleEdited, metaDescriptionEdited]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const res = await fetch(`/api/admin/categories/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    slug: slugValue,
                    metaTitle,
                    metaDescription,
                }),
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

                <div>
                    <label htmlFor="slug" className="block text-gray-700 font-medium mb-1">
                        Slug (чпу)
                    </label>
                    <input
                        id="slug"
                        type="text"
                        value={slugValue}
                        onChange={(e) => {
                            setSlugValue(e.target.value);
                            setSlugEdited(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="kategorija-na-anglijskom"
                    />
                </div>

                <div>
                    <label htmlFor="metaTitle" className="block text-gray-700 font-medium mb-1">
                        Meta Title
                    </label>
                    <input
                        id="metaTitle"
                        type="text"
                        value={metaTitle}
                        onChange={(e) => {
                            setMetaTitle(e.target.value);
                            setMetaTitleEdited(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="SEO-заголовок категории"
                    />
                </div>

                <div>
                    <label htmlFor="metaDescription" className="block text-gray-700 font-medium mb-1">
                        Meta Description
                    </label>
                    <textarea
                        id="metaDescription"
                        value={metaDescription}
                        onChange={(e) => {
                            setMetaDescription(e.target.value);
                            setMetaDescriptionEdited(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        rows={3}
                        placeholder="Краткое описание для SEO"
                    />
                </div>

                {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

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
