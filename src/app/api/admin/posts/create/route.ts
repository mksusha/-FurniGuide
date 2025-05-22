import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Функция транслитерации из кириллицы в латиницу
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
    return text.toLowerCase().split('').map(c => map[c] ?? c).join('');
};

// Генерация уникального slug для поста
async function generateUniqueSlug(baseSlug: string) {
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
}

// Генерация уникального slug для автора
async function generateUniqueAuthorSlug(name: string) {
    const baseSlug = transliterate(name)
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.author.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            title,
            slug,
            content,
            categoryId,
            authorId,
            authorName,
            imageUrl // 🔥 Добавили imageUrl
        } = body;

        if (!title || !slug || !content || !categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const category = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 400 });
        }

        let resolvedAuthorId: string | null = null;

        if (authorId) {
            const author = await prisma.author.findUnique({ where: { id: authorId } });
            if (!author) {
                return NextResponse.json({ error: "Author not found" }, { status: 400 });
            }
            resolvedAuthorId = author.id;
        } else if (authorName && authorName.trim()) {
            let author = await prisma.author.findFirst({ where: { name: authorName.trim() } });

            if (!author) {
                const uniqueAuthorSlug = await generateUniqueAuthorSlug(authorName);
                author = await prisma.author.create({
                    data: {
                        name: authorName.trim(),
                        slug: uniqueAuthorSlug,
                    },
                });
            }

            resolvedAuthorId = author.id;
        }

        const baseSlug = slug
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');

        const uniqueSlug = await generateUniqueSlug(baseSlug);

        const post = await prisma.post.create({
            data: {
                title,
                slug: uniqueSlug,
                content,
                categoryId,
                authorId: resolvedAuthorId,
                imageUrl, // ✅ Сохраняем imageUrl
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
