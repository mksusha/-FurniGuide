import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, context: any) {
    const { id } = context.params as { id: string };

    const post = await prisma.post.findUnique({
        where: { id },
    });

    return NextResponse.json(post);
}

export async function PUT(req: NextRequest, context: any) {
    const { id } = context.params as { id: string };

    try {
        const body = await req.json();

        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                content: body.content,
                imageUrl: body.imageUrl || null,
                categoryId: body.categoryId,
                authorId: body.authorId || null,
                metaTitle: body.metaTitle || null,
                metaDescription: body.metaDescription || null,
            },
        });

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error("Ошибка при обновлении поста:", error);
        return new NextResponse("Ошибка сервера", { status: 500 });
    }
}


export async function DELETE(req: NextRequest, context: any) {
    const { id } = context.params as { id: string };

    try {
        await prisma.post.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Ошибка при удалении поста:", error);
        return new NextResponse("Ошибка сервера", { status: 500 });
    }
}
