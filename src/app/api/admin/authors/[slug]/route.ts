import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, context: any) {
    const params = await context.params;
    const { slug } = params as { slug: string };

    const author = await prisma.author.findUnique({
        where: { slug },
    });

    if (!author) {
        return NextResponse.json({ error: 'Автор не найден' }, { status: 404 });
    }

    return NextResponse.json(author);
}

export async function PUT(req: NextRequest, context: any) {
    const params = await context.params;
    const { slug } = params as { slug: string };

    const body = await req.json();
    const { name, bio, avatarUrl } = body;

    if (!name) {
        return NextResponse.json({ error: 'Введите имя' }, { status: 400 });
    }

    const newSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    try {
        const updated = await prisma.author.update({
            where: { slug },
            data: {
                name,
                slug: newSlug,
                bio: bio ?? null,
                avatarUrl: avatarUrl ?? null,
            },
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Ошибка при обновлении автора' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: any) {
    const params = await context.params;
    const { slug } = params as { slug: string };

    try {
        const existing = await prisma.author.findUnique({ where: { slug } });

        if (!existing) {
            return NextResponse.json({ error: 'Автор не найден' }, { status: 404 });
        }

        await prisma.author.delete({
            where: { slug },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Ошибка при удалении автора:', err);
        return NextResponse.json({ error: 'Ошибка при удалении автора' }, { status: 500 });
    }
}
