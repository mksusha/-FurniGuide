import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Header from "@/components/Header";
import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Link from "next/link";
import Footer from "@/components/Footer";

type Props = {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const post = await prisma.post.findUnique({
        where: { slug: resolvedParams.slug },
    });

    if (!post) return {};

    return {
        title: post.metaTitle?.slice(0, 60) || post.title.slice(0, 60),
        description: post.metaDescription?.slice(0, 155) || post.subtitle?.slice(0, 155) || "",
    };
}


export default async function PostPage({ params }: Props) {
    const resolvedParams = await params;
    const post = await prisma.post.findUnique({
        where: { slug: resolvedParams.slug },
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

            <div className="flex flex-1 flex-col md:flex-row overflow-hidden pt-14">
                <div className="overflow-y-auto md:h-screen lg:w-60 border-b md:border-b-0 md:border-r border-gray-200">
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

                        {/* Автор и категория */}
                        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Автор */}
                            {post.author && (
                                <div className="flex items-center text-base text-gray-600">
                                    <img
                                        src={post.author.avatarUrl || '/images/avatar.svg'}
                                        alt={post.author.name}
                                        className="w-12 h-12 rounded-full object-cover mr-3"
                                    />
                                    <div>
                                        <p className="text-gray-500">Автор:</p>
                                        <Link
                                            href={`/author/${post.author.slug}?from=/category/${post.category.slug}/${post.slug}`}
                                            className="text-indigo-600 hover:underline font-medium"
                                        >
                                            {post.author.name}
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Категория */}
                            <div>
                                <Link
                                    href={`/category/${post.category.slug}`}
                                    className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-base font-medium hover:bg-indigo-200 transition"
                                >
                                    {post.category.name}
                                </Link>
                            </div>
                        </div>


                        {/* Заголовок и подзаголовок */}
                        <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>

                        {post.subtitle && (
                            <p className="text-lg text-gray-700 mb-6">{post.subtitle}</p>
                        )}

                        {/* Картинка */}
                        {post.imageUrl && (
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="rounded-xl w-full mb-8 border border-gray-200 shadow-sm max-h-[500px] object-cover"
                            />
                        )}

                        {/* Контент */}
                        <div
                            className="prose  max-w-none text-gray-800"
                            dangerouslySetInnerHTML={{__html: post.content}}
                        />


                    </div>
                </main>
            </div>

            <Footer/>
        </div>
    );
}
