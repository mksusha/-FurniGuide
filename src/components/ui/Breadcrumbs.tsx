"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const segmentLabels: Record<string, string> = {
    category: "", // локальные замены, если нужно
    search: "Поиск", // Добавил перевод для сегмента search
};

function capitalizeWords(str: string) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

type Category = {
    id: string;
    slug: string;
    name: string;
};

type BreadcrumbsProps = {
    currentPostTitle?: string;
    customSegments?: string[];
    authorName?: string;
    postSlug?: string;
    currentSlug?: string; // Сделали необязательным
    categories: { id: string; name: string; slug: string }[];
};


export default function Breadcrumbs({
                                        categories = [],
                                        currentPostTitle,
                                        postSlug,
                                        customSegments,
                                        authorName,
                                        currentSlug,
                                    }: BreadcrumbsProps) {
    const pathname = usePathname();

    // Если пришёл currentSlug равный 'search', то отрисовываем "Главная / Поиск"
    if (currentSlug === "search") {
        return (
            <div className="mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Главная</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbPage>Поиск</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        );
    }

    const rawSegments = customSegments || pathname.split("/").filter(Boolean);

    const segments = rawSegments.filter((seg) => seg !== "category");

    if (segments.length === 0) return null;

    // Проверяем, что текущий путь точно /post/{postSlug}
    const isOnPostPage = postSlug ? pathname === `/post/${postSlug}` : false;

    return (
        <div className="mb-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Главная</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    {segments.map((segment, index) => {
                        const isCategory = categories.some((cat) => cat.slug === segment);
                        const hrefSegments = rawSegments.slice(0, rawSegments.indexOf(segment) + 1);

                        const href = isCategory ? `/category/${segment}` : "/" + hrefSegments.join("/");

                        const isLastSegment = index === segments.length - 1;
                        const isLast = isLastSegment && !currentPostTitle && !authorName;

                        const categoryFromDb = categories.find((cat) => cat.slug === segment);

                        const label = categoryFromDb
                            ? categoryFromDb.name
                            : segmentLabels[segment]
                                ? capitalizeWords(segmentLabels[segment])
                                : capitalizeWords(decodeURIComponent(segment.replace(/-/g, " ")));

                        return (
                            <React.Fragment key={href}>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage>{label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={href}>{label}</Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </React.Fragment>
                        );
                    })}

                    {currentPostTitle && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isOnPostPage ? (
                                    <BreadcrumbPage>{currentPostTitle}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={`/post/${postSlug}`}>{currentPostTitle}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </>
                    )}

                    {authorName && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{authorName}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}
