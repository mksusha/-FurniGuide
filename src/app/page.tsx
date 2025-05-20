import HomePageClient from "../components/HomePageClient";
import { prisma } from "@/lib/prisma";

const POSTS_PER_PAGE = 9;

export default async function Page() {
    const [posts, categories] = await Promise.all([
        prisma.post.findMany({
            take: POSTS_PER_PAGE,
            orderBy: { createdAt: "desc" },
            include: { category: true },
        }),
        prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);

    return <HomePageClient initialPosts={posts} initialCategories={categories} />;
}
