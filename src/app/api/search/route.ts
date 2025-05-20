import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const POSTS_PER_PAGE = 6

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)

    if (!q.trim()) {
        return NextResponse.json({
            posts: [],
            totalPages: 0,
        })
    }

    const where = {
        OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { subtitle: { contains: q, mode: 'insensitive' as const } },
            { content: { contains: q, mode: 'insensitive' as const } },
            { author: { name: { contains: q, mode: 'insensitive' as const } } },
        ],
    }

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            include: {
                author: true,
                category: true,
            },
            orderBy: { publishedAt: 'desc' },
            skip: (page - 1) * POSTS_PER_PAGE,
            take: POSTS_PER_PAGE,
        }),
        prisma.post.count({ where }),
    ])

    return NextResponse.json({
        posts,
        totalPages: Math.ceil(total / POSTS_PER_PAGE),
    })
}
