'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TiptapEditor from "@/app/admin/components/TiptapEditor";
import '@/app/admin/tiptap-editor.css';

const schema = z.object({
    title: z.string().min(3, 'Минимум 3 символа'),
    slug: z.string(),
    content: z.string(),
    categoryName: z.string().min(1, 'Обязательное поле'),
    authorName: z.string().optional(),
    imageUrl: z.string().url('Некорректная ссылка').optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type Option = { id: string; name: string };

export default function CreatePost() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        getValues,

        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            content: '',
            metaTitle: '',
            metaDescription: '',
        }
    });

    const [categories, setCategories] = useState<Option[]>([]);
    const [authors, setAuthors] = useState<Option[]>([]);

    const title = watch('title');
    const metaTitle = watch('metaTitle');
    const metaDescription = watch('metaDescription');
    const imageUrl = watch('imageUrl');

    // Инициализация редактора TipTap
    const editor = useEditor({
        extensions: [
            StarterKit,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: '',
        onUpdate({ editor }) {
            setValue('content', editor.getHTML(), { shouldValidate: true });
        },
    });

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

    useEffect(() => {
        const raw = (title || '').trim();
        const slug = transliterate(raw)
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');

        if (raw) {
            setValue('slug', slug);

            const currentMetaTitle = getValues('metaTitle');
            const currentMetaDescription = getValues('metaDescription');

            // Если пользователь не вводил свой metaTitle — обновим автоматически
            if (!currentMetaTitle || currentMetaTitle.startsWith('Пост: ')) {
                setValue('metaTitle', `Пост: ${raw}`);
            }

            // Аналогично для metaDescription
            if (!currentMetaDescription || currentMetaDescription.startsWith('Описание статьи "')) {
                setValue('metaDescription', `Описание статьи "${raw}"`);
            }
        }
    }, [title, setValue, getValues]);




    useEffect(() => {
        fetch('/api/admin/categories')
            .then((res) => res.json())
            .then(setCategories);

        fetch('/api/admin/authors')
            .then((res) => res.json())
            .then(setAuthors);
    }, []);

    const findByName = (arr: Option[], name: string) =>
        arr.find((item) => item.name.toLowerCase() === name.trim().toLowerCase());

    const ensureCategory = async (name: string) => {
        const existing = findByName(categories, name);
        if (existing) return existing.id;

        const res = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        const created = await res.json();
        return created.id;
    };

    const ensureAuthor = async (name?: string) => {
        if (!name?.trim()) return undefined;

        const existing = findByName(authors, name);
        if (existing) return existing.id;

        const res = await fetch('/api/admin/authors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        const created = await res.json();
        return created.id;
    };

    const onSubmit = async (data: FormValues) => {
        try {
            if (!data.title.trim()) throw new Error('Заголовок обязателен');
            if (!data.content.trim()) throw new Error('Контент обязателен');
            if (!data.categoryName.trim()) throw new Error('Категория обязательна');

            const categoryId = await ensureCategory(data.categoryName);
            if (!categoryId) throw new Error('Не удалось получить ID категории');

            const authorId = data.authorName ? await ensureAuthor(data.authorName) : null;

            const body = {
                title: data.title,
                slug: data.slug,
                content: data.content,
                categoryId,
                authorId,
                imageUrl: data.imageUrl || null,
                metaTitle: data.metaTitle || null,
                metaDescription: data.metaDescription || null,
            };

            console.log('Отправляем тело:', body);

            const res = await fetch('/api/admin/posts/create', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const json = await res.json();

            if (!res.ok) {
                alert(`Ошибка: ${json.error || 'Неизвестная ошибка'}`);
                return;
            }

            console.log('Пост создан:', json);
        } catch (err) {
            alert(`Ошибка при отправке: ${(err as Error).message}`);
        }
    };


    const [uploading, setUploading] = useState(false);

    // Обработка загрузки файла
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                alert('Ошибка загрузки изображения');
                return;
            }

            const data = await res.json();

            if (data.url) {
                setValue('imageUrl', data.url, { shouldValidate: true });
            } else {
                alert('Не удалось получить ссылку на изображение.');
            }
        } catch (error) {
            console.error(error);
            alert('Ошибка загрузки изображения. Попробуйте позже.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Создание поста</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <InputField label="Заголовок" error={errors.title?.message}>
                    <input
                        {...register('title')}
                        placeholder="Введите заголовок"
                        className={`w-full rounded-md border border-gray-300 px-4 py-2
                            text-black placeholder-gray-500
                            focus:outline-none focus:ring-2 focus:ring-indigo-600 transition
                            ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                </InputField>

                <InputField label="Slug" error={errors.slug?.message}>
                    <input
                        {...register('slug')}
                        placeholder="slug"
                        className={`w-full rounded-md border border-gray-300 px-4 py-2
                            text-black placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-indigo-600 transition
                            ${errors.slug ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                </InputField>

                <InputField label="Meta Title">
                    <input
                        {...register('metaTitle')}
                        placeholder="Meta Title (если пусто — генерируется автоматически)"
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                    />
                </InputField>

                <InputField label="Meta Description">
                    <textarea
                        {...register('metaDescription')}
                        placeholder="Meta Description (если пусто — генерируется автоматически)"
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                    />
                </InputField>

                <InputField label="Ссылка на изображение" error={errors.imageUrl?.message}>
                    <input
                        {...register('imageUrl')}
                        placeholder="https://..."
                        className={`w-full rounded-md border border-gray-300 px-4 py-2
                            text-black placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-indigo-600 transition
                            ${errors.imageUrl ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Превью"
                            className="mt-4 max-h-64 rounded-lg shadow-sm object-contain mx-auto"
                        />
                    )}
                </InputField>

                <InputField label="Загрузить изображение">
                    <input type="file" onChange={onFileChange} disabled={uploading} />
                    {uploading && <p className="text-sm text-gray-500 mt-1">Загрузка...</p>}
                </InputField>

                <TiptapEditor editor={editor} />

                <InputField label="Категория (можно новую)" error={errors.categoryName?.message}>
                    <input
                        {...register('categoryName')}
                        list="category-list"
                        placeholder="Категория"
                        className={`w-full rounded-md border border-gray-300 px-4 py-2
                            text-black placeholder-gray-500
                            focus:outline-none focus:ring-2 focus:ring-indigo-600 transition
                            ${errors.categoryName ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    <datalist id="category-list">
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name} />
                        ))}
                    </datalist>
                </InputField>

                <InputField label="Автор (необязательно)" error={errors.authorName?.message}>
                    <input
                        {...register('authorName')}
                        list="author-list"
                        placeholder="Автор"
                        className={`w-full rounded-md border border-gray-300 px-4 py-2
                            text-black placeholder-gray-500
                            focus:outline-none focus:ring-2 focus:ring-indigo-600 transition
                            ${errors.authorName ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    <datalist id="author-list">
                        {authors.map((author) => (
                            <option key={author.id} value={author.name} />
                        ))}
                    </datalist>
                </InputField>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold text-lg transition"
                >
                    Создать пост
                </button>
            </form>
        </div>
    );
}

function InputField({
                        label,
                        children,
                        error,
                    }: {
    label: string;
    children: React.ReactNode;
    error?: string;
}) {
    return (
        <div>
            <label className="block mb-2 font-semibold text-gray-700">{label}</label>
            {children}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
