import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import { AppSidebar } from '@/components/app-sidebar'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { Pagination } from '@/components/ui/pagination'
import SearchResultCard from '@/components/SearchResultCard'
import SearchInputPage from '@/components/SearchInputPage'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'

type Props = {
    searchParams: Promise<{
        q?: string
        page?: string
    }>
}

const POSTS_PER_PAGE = 6

export async function generateMetadata({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams
    const q = resolvedSearchParams.q || ''

    if (!q.trim()) return { title: 'Поиск' }

    return {
        title: `Результаты поиска по запросу: ${q}`,
        description: `Найдены статьи по запросу ${q}`,
    }
}

export default async function SearchPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams
    const q = (resolvedSearchParams.q || '').trim()
    const page = Number(resolvedSearchParams.page) || 1

    if (!q) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header categories={[]} />
                <div className="flex flex-1 overflow-hidden pt-14">
                    <div className="overflow-y-auto h-screen">
                        <AppSidebar categories={[]} />
                    </div>
                    <main className="flex-1 p-8 overflow-y-auto">
                        <div className="max-w-7xl mx-auto">
                            <Breadcrumbs currentSlug="search" categories={[]} />
                            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl mb-6">
                                Введите поисковый запрос
                            </h1>
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        )
    }

    const categoriesPromise = prisma.category.findMany({
        orderBy: { name: 'asc' },
    })

    const where = {
        OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { subtitle: { contains: q, mode: 'insensitive' as const } },
            { content: { contains: q, mode: 'insensitive' as const } },
            { author: { name: { contains: q, mode: 'insensitive' as const } } },
        ],
    }

    const postsPromise = prisma.post.findMany({
        where,
        include: {
            author: true,
            category: true,
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
    })

    const totalPromise = prisma.post.count({ where })

    const [categories, posts, total] = await Promise.all([
        categoriesPromise,
        postsPromise,
        totalPromise,
    ])

    const totalPages = Math.ceil(total / POSTS_PER_PAGE)

    if (!categories) return notFound()

    return (
        <div className="min-h-screen flex flex-col">
            <Header categories={categories} />

            <div className="flex flex-1 overflow-hidden pt-16">
                <div className="overflow-y-auto h-screen">
                    <AppSidebar categories={categories} />
                </div>

                <main className="flex-1 p-8 overflow-y-auto">
                    <Breadcrumbs currentSlug="search" categories={categories} />
                    <div className="max-w-4xl mx-auto">
                        <SearchInputPage />
                        <p className="text-gray-600 my-5">
                            Найдено результатов: <strong>{total}</strong>
                        </p>

                        {posts.length === 0 ? (
                            <p>Ничего не найдено.</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-8">
                                    {posts.map((post) => (
                                        <SearchResultCard
                                            key={post.id}
                                            post={post}
                                            categoryName={post.category?.name || ''}
                                            siteUrl="https://furni-guide.vercel.app"

                                        />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-10">
                                        <Pagination
                                            totalPages={totalPages}
                                            currentPage={page}
                                            basePath="/search"
                                            query={{ q }}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    )
}
