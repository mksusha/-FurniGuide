'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    title: z.string().min(3, 'Минимум 3 символа'),
    slug: z.string(),
    content: z.string(),
    imageUrl: z.string().optional(),
    categoryId: z.string().min(1, 'Выберите категорию'),
    authorId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type Option = { id: string; name: string };

export default function EditPost() {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const [categories, setCategories] = useState<Option[]>([]);
    const [authors, setAuthors] = useState<Option[]>([]);

    const title = watch('title');
    const imageUrl = watch('imageUrl');

    // Автогенерация слага
    useEffect(() => {
        const transliterate = (text: string) => {
            const map: Record<string, string> = {
                а: 'a', б: 'b', в: 'v', г: 'g', д: 'd',
                е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
                й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
                о: 'o', п: 'p', р: 'r', с: 's', т: 't',
                у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch',
                ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
                э: 'e', ю: 'yu', я: 'ya',
            };

            return text
                .toLowerCase()
                .split('')
                .map((char) => map[char] ?? char)
                .join('');
        };

        const raw = title?.trim() || '';
        const slug = transliterate(raw)
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');

        if (slug) setValue('slug', slug);
    }, [title, setValue]);

    // Загрузка поста, категорий и авторов
    useEffect(() => {
        const fetchData = async () => {
            const [postRes, categoriesRes, authorsRes] = await Promise.all([
                fetch(`/api/admin/posts/${id}`),
                fetch('/api/admin/categories'),
                fetch('/api/admin/authors'),
            ]);

            const post = await postRes.json();
            const cats = await categoriesRes.json();
            const auths = await authorsRes.json();

            setCategories(cats);
            setAuthors(auths);

            reset({
                title: post.title,
                slug: post.slug,
                content: post.content,
                imageUrl: post.imageUrl || '',
                categoryId: post.categoryId || '',
                authorId: post.authorId || '',
            });
        };

        fetchData();
    }, [id, reset]);

    const onSubmit = async (data: FormValues) => {
        console.log('Sending:', data); // ⬅️ Посмотри в консоли, точно ли categoryId есть и верный
        await fetch(`/api/admin/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        router.push('/admin/posts');
    };


    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Редактировать пост</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Title */}
                <div>
                    <label className="block font-medium mb-1">Заголовок</label>
                    <input {...register('title')} className="w-full border rounded px-3 py-2" />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Slug */}
                <div>
                    <label className="block font-medium mb-1">Slug</label>
                    <input {...register('slug')} className="w-full border rounded px-3 py-2" />
                </div>

                {/* Image */}
                <div>
                    <label className="block font-medium mb-1">Ссылка на изображение</label>
                    <input {...register('imageUrl')} className="w-full border rounded px-3 py-2" />
                    {imageUrl && <img src={imageUrl} alt="Превью" className="mt-2 max-h-60 rounded shadow" />}
                </div>

                {/* Content */}
                <div>
                    <label className="block font-medium mb-1">Контент</label>
                    <textarea {...register('content')} className="w-full border rounded px-3 py-2 h-40" />
                </div>

                {/* Category */}
                <div>
                    <label className="block font-medium mb-1">Категория</label>
                    <select {...register('categoryId')} className="w-full border rounded px-3 py-2">
                        <option value="">Выберите категорию</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
                </div>

                {/* Author */}
                <div>
                    <label className="block font-medium mb-1">Автор</label>
                    <select {...register('authorId')} className="w-full border rounded px-3 py-2">
                        <option value="">Без автора</option>
                        {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                                {author.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 transition"
                >
                    Сохранить изменения
                </button>
            </form>
        </div>
    );
}
