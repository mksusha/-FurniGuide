import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Ошибка при получении категорий:", error);
        return NextResponse.json(
            { error: "Не удалось получить категории" },
            { status: 500 }
        );
    }
}
