import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                createdAt: true,
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error loading posts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
