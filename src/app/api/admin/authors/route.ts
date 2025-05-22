import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Транслитерация кириллицы в латиницу
const transliterate = (text: string) => {
    const map: Record<string, string> = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd',
        е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
        й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
        о: 'o', п: 'p', р: 'r', с: 's', т: 't',
        у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch',
        ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
        э: 'e', ю: 'yu', я: 'ya',
    };
    return text.toLowerCase().split('').map(c => map[c] ?? c).join('');
};

// Генерация уникального слага для автора
async function generateUniqueAuthorSlug(name: string) {
    const baseSlug = transliterate(name)
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.author.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
}

export async function GET() {
    const authors = await prisma.author.findMany({
        orderBy: { name: "asc" },
    });

    return NextResponse.json(authors);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const name = body.name?.trim();

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Проверка, существует ли уже автор с таким именем
    const existing = await prisma.author.findFirst({
        where: { name },
    });

    if (existing) return NextResponse.json(existing);

    // Генерация слага с транслитерацией
    const slug = await generateUniqueAuthorSlug(name);

    const newAuthor = await prisma.author.create({
        data: {
            name,
            slug,
        },
    });

    return NextResponse.json(newAuthor);
}
