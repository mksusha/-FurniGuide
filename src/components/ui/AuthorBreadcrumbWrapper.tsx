"use client";

import { useSearchParams } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

type Post = {
    slug: string;
    title: string;
    category: { slug: string; name: string };
};

type Category = {
    id: string;
    slug: string;
    name: string;
};

type Props = {
    authorName: string;
    posts: Post[];
    categories: Category[];
};

export default function AuthorBreadcrumbWrapper({ authorName, posts, categories }: Props) {
    const searchParams = useSearchParams();
    const from = searchParams.get("from"); // например "/category/sadovaya-mebel/obedennaya-zona-v-sadu"

    const segments = from?.split("/").filter(Boolean) || [];

    const categorySlug = segments[1];
    const postSlug = segments[2];

    const post = posts.find((p) => p.slug === postSlug);

    const customSegments = categorySlug ? [categorySlug] : [];

    return (
        <Breadcrumbs
            categories={categories}
            customSegments={customSegments}      // только категория для хлебных крошек
            currentPostTitle={post?.title || ""}
            postSlug={post?.slug}                // ссылка на пост
            authorName={authorName}

        />
    );
}
