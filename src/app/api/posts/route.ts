// /pages/api/posts.ts или /app/api/posts/page.tsx (Next.js 13+)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const POSTS_PER_PAGE = 9;

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;

    const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
        include: {
            category: true,
        },
    });


    return new NextResponse(JSON.stringify(posts), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store", // 👈 критично важно
        },
    });
}
