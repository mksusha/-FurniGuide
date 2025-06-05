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

        return new NextResponse(JSON.stringify(categories), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
        });

    } catch (error) {
        console.error("Ошибка при получении категорий:", error);
        return NextResponse.json(
            { error: "Не удалось получить категории" },
            { status: 500 }
        );
    }
}
