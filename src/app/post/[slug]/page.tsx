import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Header from "@/components/Header";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Link from "next/link";
import Footer from "@/components/Footer";

type Props = {
    params: { slug: string };
};

// SEO метаданные
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await prisma.post.findUnique({
        where: { slug: params.slug },
    });

    if (!post) return {};

    return {
        title: post.title.slice(0, 60),
        description: post.subtitle?.slice(0, 155) ?? "",
    };
}

export default async function PostPage({ params }: Props) {
    const post = await prisma.post.findUnique({
        where: { slug: params.slug },
        include: {
            category: true,
            author: true,
        },
    });

    if (!post) return notFound();

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Header categories={categories} />

            {/* Основной блок растягивается между хедером и футером */}
            <div className="flex flex-1 flex-col md:flex-row overflow-hidden pt-14">
                <div className="overflow-y-auto md:h-screen md:w-60 border-b md:border-b-0 md:border-r border-gray-200">
                    <AppSidebar categories={categories} />
                </div>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col">

                        <Breadcrumbs
                            categories={categories}
                            currentPostTitle={post.title}
                            customSegments={["category", post.category.slug]}
                            postSlug={post.slug}
                            currentSlug={post.slug}
                        />
                    <div className="max-w-3xl mx-auto w-full">
                        <p className="text-sm text-gray-500 mb-2">
                            Категория:{" "}
                            <a
                                href={`/category/${post.category.slug}`}
                                className="text-indigo-600 hover:underline"
                            >
                                {post.category.name}
                            </a>
                        </p>

                        {post.author && (
                            <div className="mb-4 flex items-center gap-3 text-sm text-gray-600">
                                {post.author.avatarUrl && (
                                    <img
                                        src={post.author.avatarUrl}
                                        alt={post.author.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                )}
                                <span>
                  Автор:{" "}
                                    <Link
                                        href={`/author/${post.author.slug}?from=/category/${post.category.slug}/${post.slug}`}
                                        className="text-indigo-600 hover:underline"
                                    >
                    {post.author.name}
                  </Link>
                </span>
                            </div>
                        )}

                        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                        {post.subtitle && (
                            <p className="text-lg text-gray-700 mb-6">{post.subtitle}</p>
                        )}

                        {post.imageUrl && (
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="rounded-xl w-full mb-8"
                            />
                        )}

                        <div className="prose max-w-none">
                            <p>{post.content}</p>
                        </div>
                    </div>
                </main>
            </div>

            {/* Футер вне main, всегда снизу */}
            <Footer />
        </div>
    );
}
