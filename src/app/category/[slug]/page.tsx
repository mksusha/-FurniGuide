// app/category/[slug]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Header from "@/components/Header";
import { AppSidebar } from "@/components/app-sidebar";
import PostCard from "@/components/PostCard";
import { Pagination } from "@/components/ui/pagination";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Footer from "@/components/Footer";

const POSTS_PER_PAGE = 6;

// Параметры страницы, как Next.js ожидает
export type CategoryPageProps = {
    params: { slug: string };
    searchParams?: { page?: string };
};

// ✅ Типы соответствуют ожиданиям Next.js
export async function generateMetadata(
    { params }: { params: { slug: string } }
): Promise<Metadata> {
    const category = await prisma.category.findUnique({
        where: { slug: params.slug },
    });

    if (!category) return {};

    return {
        title: category.name.slice(0, 60),
        description: `Статьи и материалы по категории: ${category.name}`.slice(0, 155),
    };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug } = params;
    const page = Number(searchParams?.page) || 1;

    const category = await prisma.category.findUnique({
        where: { slug },
    });

    if (!category) return notFound();

    const totalPosts = await prisma.post.count({
        where: { categoryId: category.id },
    });

    const posts = await prisma.post.findMany({
        where: { categoryId: category.id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
        include: {
            author: true,
            category: true,
        },
    });

    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Header categories={categories} />

            <div className="flex flex-1 flex-col md:flex-row overflow-hidden pt-14">
                <div className="overflow-y-auto md:h-screen md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
                    <AppSidebar categories={categories} />
                </div>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col">
                    <div className="max-w-7xl mx-auto w-full">
                        <Breadcrumbs currentSlug={slug} categories={categories} />
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                            {category.name}
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">Последние статьи в категории</p>
                        <div className="w-20 md:w-1/3 h-1 bg-indigo-600 mt-5 rounded"></div>

                        {posts.length === 0 ? (
                            <p className="mt-10 text-gray-500">Нет статей в этой категории.</p>
                        ) : (
                            <>
                                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {posts.map((post) => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            categoryName={category.name}
                                            siteUrl="https://your-site-url.com"
                                        />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-10">
                                        <Pagination
                                            totalPages={totalPages}
                                            currentPage={page}
                                            basePath={`/category/${slug}`}
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
    );
}
