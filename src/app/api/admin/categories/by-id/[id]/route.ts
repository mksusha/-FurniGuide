import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// @ts-ignore
export async function DELETE(req: NextRequest, context: any) {
    const { id } = context.params;

    try {
        const existing = await prisma.category.findUnique({ where: { id } });

        if (!existing) {
            return NextResponse.json({ error: 'Категория не найдена' }, { status: 404 });
        }

        await prisma.category.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Ошибка при удалении категории' }, { status: 500 });
    }
}
