import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Header from "@/components/Header";
import { AppSidebar } from "@/components/app-sidebar";
import AuthorBreadcrumbWrapper from "@/components/ui/AuthorBreadcrumbWrapper";
import PostCardHorizontal from "@/components/PostCardHorizontal";
import Footer from "@/components/Footer";

type Props = {
    params: { slug: string };
};

// SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const author = await prisma.author.findUnique({
        where: { slug: params.slug },
    });

    if (!author) return {};

    return {
        title: `Автор: ${author.name}`,
        description: author.bio || "",
    };
}

export default async function AuthorPage({ params }: Props) {
    const author = await prisma.author.findUnique({
        where: { slug: params.slug },
        include: {
            posts: {
                include: { category: true },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!author) return notFound();

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Header categories={categories} />

            {/* Основной контент — сайдбар и main */}
            <div className="flex flex-1 flex-col md:flex-row pt-14 overflow-hidden">
                <div className="overflow-y-auto md:h-screen md:w-60 border-b md:border-b-0 md:border-r border-gray-200">
                    <AppSidebar categories={categories} />
                </div>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col">
                    <AuthorBreadcrumbWrapper
                        authorName={author.name}
                        posts={author.posts}
                        categories={categories}
                    />

                    <div className="max-w-4xl mx-auto w-full">
                        <div className="bg-indigo-600/50 p-6 rounded-3xl mb-5 shadow-sm border border-gray-200 flex items-center gap-5">
                            {author.avatarUrl && (
                                <img
                                    src={author.avatarUrl}
                                    alt={author.name}
                                    className="w-20 h-20 rounded-full object-cover shadow-md"
                                />
                            )}
                            <div>
                                <h1 className="text-3xl font-bold text-white">{author.name}</h1>
                                {author.bio && (
                                    <p className="text-white mt-2 text-sm leading-relaxed">
                                        {author.bio}
                                    </p>
                                )}
                            </div>
                        </div>

                        <h2 className="text-2xl font-semibold mb-4">
                            Публикации автора ({author.posts.length})
                        </h2>

                        <ul className="space-y-6">
                            {author.posts.map((post) => (
                                <li key={post.id}>
                                    <PostCardHorizontal
                                        post={{
                                            id: post.id,
                                            slug: post.slug,
                                            title: post.title,
                                            subtitle: post.subtitle,
                                            createdAt: post.createdAt,
                                            imageUrl: post.imageUrl,
                                        }}
                                        categoryName={post.category?.name ?? "Без категории"}
                                        siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </main>
            </div>

            {/* Футер вне main, всегда снизу */}
            <Footer />
        </div>
    );
}
