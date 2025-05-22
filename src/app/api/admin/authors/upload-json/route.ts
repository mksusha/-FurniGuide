import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const authors = await req.json();

        if (!Array.isArray(authors)) {
            return NextResponse.json({ error: 'Ожидается массив авторов' }, { status: 400 });
        }

        for (const author of authors) {
            if (!author.name || typeof author.name !== 'string') {
                return NextResponse.json({ error: 'Каждый автор должен иметь поле name типа string' }, { status: 400 });
            }
            if (author.bio && typeof author.bio !== 'string') {
                return NextResponse.json({ error: 'Поле bio должно быть строкой' }, { status: 400 });
            }
            if (author.avatarUrl && typeof author.avatarUrl !== 'string') {
                return NextResponse.json({ error: 'Поле avatarUrl должно быть строкой' }, { status: 400 });
            }
        }

        const createdAuthors = [];

        for (const author of authors) {
            const slug = slugify(author.name);

            // Проверяем, есть ли уже такой автор
            const exists = await prisma.author.findUnique({ where: { slug } });
            if (exists) {
                createdAuthors.push(exists);
                continue;
            }

            try {
                const created = await prisma.author.create({
                    data: {
                        name: author.name,
                        bio: author.bio || '',
                        avatarUrl: author.avatarUrl || '',
                        slug,
                    },
                });
                createdAuthors.push(created);
            } catch (e) {
                return NextResponse.json({ error: `Ошибка создания автора ${author.name}` }, { status: 500 });
            }
        }

        return NextResponse.json(createdAuthors);
    } catch (e) {
        return NextResponse.json({ error: 'Ошибка обработки запроса' }, { status: 500 });
    }
}

function slugify(text: string) {
    const cyrillicToLatinMap: Record<string, string> = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
        з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
        п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts',
        ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
    };

    return text
        .toLowerCase()
        .trim()
        .split('')
        .map(char => cyrillicToLatinMap[char] || char)
        .join('')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}
