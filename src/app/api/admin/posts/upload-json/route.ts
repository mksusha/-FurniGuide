import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Простая транслитерация с русского в английский для slug
function transliterate(text: string) {
    const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d",
        е: "e", ё: "e", ж: "zh", з: "z", и: "i",
        й: "y", к: "k", л: "l", м: "m", н: "n",
        о: "o", п: "p", р: "r", с: "s", т: "t",
        у: "u", ф: "f", х: "h", ц: "ts", ч: "ch",
        ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
        э: "e", ю: "yu", я: "ya",
    };

    return text
        .toLowerCase()
        .split("")
        .map((char) => map[char] ?? char)
        .join("")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");
}

export async function POST(req: NextRequest) {
    try {
        const posts = await req.json();

        if (!Array.isArray(posts)) {
            return NextResponse.json({ error: "Ожидается массив постов" }, { status: 400 });
        }

        const createdOrUpdatedPosts = [];

        for (const post of posts) {
            if (!post.title || !post.categoryName) {
                return NextResponse.json({ error: "У каждого поста должны быть title и categoryName" }, { status: 400 });
            }

            // Ищем категорию по названию (case-insensitive)
            let category = await prisma.category.findFirst({
                where: {
                    name: {
                        equals: post.categoryName,
                        mode: "insensitive",
                    },
                },
            });

            // Если нет - создаём новую с транслитерированным slug
            if (!category) {
                const slug = transliterate(post.categoryName);
                category = await prisma.category.create({
                    data: {
                        name: post.categoryName,
                        slug,
                    },
                });
            }

            let author = null;
            if (post.authorName) {
                author = await prisma.author.findFirst({
                    where: {
                        name: {
                            equals: post.authorName,
                            mode: "insensitive",
                        },
                    },
                });

                if (!author) {
                    const slug = transliterate(post.authorName);
                    author = await prisma.author.create({
                        data: {
                            name: post.authorName,
                            slug,
                        },
                    });
                }
            }

            const slug = post.slug || transliterate(post.title);

            const createdOrUpdatedPost = await prisma.post.upsert({
                where: { slug },
                update: {
                    title: post.title,
                    content: post.content || "",
                    imageUrl: post.imageUrl || null,
                    categoryId: category.id,
                    authorId: author ? author.id : null,
                },
                create: {
                    title: post.title,
                    slug,
                    content: post.content || "",
                    imageUrl: post.imageUrl || null,
                    categoryId: category.id,
                    authorId: author ? author.id : null,
                },
            });

            createdOrUpdatedPosts.push(createdOrUpdatedPost);
        }

        return NextResponse.json({ success: true, posts: createdOrUpdatedPosts });
    } catch (error: any) {
        console.error("Ошибка при загрузке постов:", error);
        return NextResponse.json({ error: error.message || "Внутренняя ошибка сервера" }, { status: 500 });
    }
}
