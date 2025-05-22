import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const categories = await req.json();

        if (!Array.isArray(categories)) {
            return NextResponse.json({ error: 'Ожидается массив категорий' }, { status: 400 });
        }

        for (const cat of categories) {
            if (!cat.name || typeof cat.name !== 'string') {
                return NextResponse.json({ error: 'Каждая категория должна иметь поле name типа string' }, { status: 400 });
            }
        }

        const createdCategories = [];

        for (const cat of categories) {
            const slug = slugify(cat.name);

            const exists = await prisma.category.findUnique({ where: { slug } });
            if (exists) {
                createdCategories.push(exists);
                continue;
            }

            try {
                const created = await prisma.category.create({
                    data: {
                        name: cat.name,
                        slug,
                    },
                });
                createdCategories.push(created);
            } catch (e) {
                return NextResponse.json({ error: `Ошибка создания категории ${cat.name}` }, { status: 500 });
            }
        }

        return NextResponse.json(createdCategories);
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
