import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, context: any) {
    const { slug } = context.params as { slug: string };

    const category = await prisma.category.findUnique({
        where: { slug },
    });

    if (!category) {
        return NextResponse.json({ error: 'Категория не найдена' }, { status: 404 });
    }

    return NextResponse.json(category);
}

export async function DELETE(req: NextRequest, context: any) {
    const { slug } = context.params as { slug: string };

    try {
        const category = await prisma.category.findUnique({
            where: { slug },
        });

        if (!category) {
            return NextResponse.json({ error: 'Категория не найдена' }, { status: 404 });
        }

        await prisma.category.delete({
            where: { slug },
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Ошибка при удалении категории:', e);
        return NextResponse.json({ error: 'Ошибка удаления категории' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: any) {
    const { slug } = context.params as { slug: string };

    try {
        const body = await req.json();
        const newName = body.name?.trim();
        const inputSlug = body.slug?.trim();
        const metaTitle = body.metaTitle?.trim();
        const metaDescription = body.metaDescription?.trim();

        if (!newName) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const category = await prisma.category.findUnique({
            where: { slug },
        });

        if (!category) {
            return NextResponse.json({ error: 'Категория не найдена' }, { status: 404 });
        }

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

        const newSlug = inputSlug ? slugify(inputSlug) : slugify(newName);

        const existingCategory = await prisma.category.findUnique({
            where: { slug: newSlug },
        });

        if (existingCategory && existingCategory.id !== category.id) {
            return NextResponse.json({ error: 'Категория с таким slug уже существует' }, { status: 409 });
        }

        const updatedCategory = await prisma.category.update({
            where: { slug },
            data: {
                name: newName,
                slug: newSlug,
                metaTitle,
                metaDescription,
            },
        });

        return NextResponse.json(updatedCategory);
    } catch (e) {
        console.error('Ошибка при обновлении категории:', e);
        return NextResponse.json({ error: 'Ошибка при обновлении' }, { status: 500 });
    }
}
