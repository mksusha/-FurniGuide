'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useEditor } from '@tiptap/react';
import '@/app/admin/tiptap-editor.css';
import type { Level } from '@tiptap/extension-heading';
import TiptapEditor from '@/app/admin/components/TiptapEditor';

const schema = z.object({
    title: z.string().min(3, 'Минимум 3 символа'),
    slug: z.string(),
    content: z.string(),
    imageUrl: z.string().optional(),
    categoryId: z.string().min(1, 'Выберите категорию'),
    authorId: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
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
    const [uploading, setUploading] = useState(false);
    const [metaTitleTouched, setMetaTitleTouched] = useState(false);
    const [metaDescriptionTouched, setMetaDescriptionTouched] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: false }),
            Heading.configure({ levels: [1, 2, 3, 4, 5] }),
            ListItem,
            BulletList,
            OrderedList,
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
        ],
        content: '',
        onUpdate: ({ editor }) => {
            setValue('content', editor.getHTML());
        },
    });

    const metaTitle = watch('metaTitle');
    const metaDescription = watch('metaDescription');

    useEffect(() => {
        const transliterate = (text: string) => {
            const map: Record<string, string> = {
                а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
                и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
                с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
                ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
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

        if (raw) {
            if (!metaTitleTouched) {
                setValue('metaTitle', `Пост: ${raw}`);
            }
            if (!metaDescriptionTouched) {
                setValue('metaDescription', `Описание статьи "${raw}"`);
            }
        }
    }, [title, metaTitleTouched, metaDescriptionTouched, setValue]);



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
                metaTitle: post.metaTitle || '',
                metaDescription: post.metaDescription || '',
            });

            if (editor && post.content) {
                editor.commands.setContent(post.content);
            }
        };

        if (editor) {
            fetchData();
        }
    }, [id, reset, editor]);

    const onSubmit = async (data: FormValues) => {
        await fetch(`/api/admin/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        router.push('/admin/posts');
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            console.warn('Файл не выбран');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                console.error('Ошибка сервера при загрузке файла:', res.statusText);
                alert('Ошибка загрузки изображения. Попробуйте снова.');
                return;
            }

            const data = await res.json();
            console.log('Ответ от сервера загрузки:', data);

            if (data.url) {
                setValue('imageUrl', data.url, { shouldValidate: true });
            } else {
                alert('Не удалось получить ссылку на изображение.');
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            alert('Ошибка загрузки изображения. Попробуйте позже.');
        } finally {
            setUploading(false);
        }
    };


    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-black">Редактировать пост</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block font-medium mb-1">Заголовок</label>
                    <input {...register('title')} className="w-full border rounded-xl px-3 py-2"/>
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block font-medium mb-1">Slug</label>
                    <input {...register('slug')} className="w-full border rounded-xl px-3 py-2"/>
                </div>
                <div>
                    <label className="block font-medium mb-1">Meta Title</label>
                    <input
                        {...register('metaTitle')}
                        placeholder="Meta Title"
                        className="w-full border rounded-xl px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Meta Description</label>
                    <textarea
                        {...register('metaDescription')}
                        placeholder="Meta Description"
                        rows={3}
                        className="w-full border rounded-xl px-3 py-2"
                    />
                </div>


                <div>
                    <label className="block font-medium mb-1">Ссылка на изображение</label>
                    <input {...register('imageUrl')} className="w-full border rounded-xl px-3 py-2"/>
                    {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 max-h-60 rounded-xl shadow"/>}
                </div>

                <div>
                    <label className="block font-medium mb-1">Загрузить изображение</label>
                    <input type="file" onChange={onFileChange} disabled={uploading}/>
                    {uploading && <p>Загрузка...</p>}
                </div>

                <div className="prose bg-white text-black">
                    <TiptapEditor editor={editor}/>
                </div>

                <div>
                    <label className="block font-medium mb-1">Категория</label>
                    <select {...register('categoryId')} className="w-full border rounded-xl px-3 py-2">
                        <option value="">Выберите категорию</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
                </div>

                <div>
                    <label className="block font-medium mb-1">Автор</label>
                    <select {...register('authorId')} className="w-full border rounded-xl px-3 py-2">
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
                    className="bg-black/90 text-white px-6 py-2 rounded-xl shadow hover:bg-gray-800 transition"
                >
                    Сохранить изменения
                </button>
            </form>
        </div>
    );
}
