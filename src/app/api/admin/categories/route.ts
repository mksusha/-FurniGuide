import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Функция транслитерации для создания slug на латинице
function slugify(text: string): string {
    const transliterated = text
        .toLowerCase()
        .replace(/а/g, 'a')
        .replace(/б/g, 'b')
        .replace(/в/g, 'v')
        .replace(/г/g, 'g')
        .replace(/д/g, 'd')
        .replace(/е/g, 'e')
        .replace(/ё/g, 'e')
        .replace(/ж/g, 'zh')
        .replace(/з/g, 'z')
        .replace(/и/g, 'i')
        .replace(/й/g, 'y')
        .replace(/к/g, 'k')
        .replace(/л/g, 'l')
        .replace(/м/g, 'm')
        .replace(/н/g, 'n')
        .replace(/о/g, 'o')
        .replace(/п/g, 'p')
        .replace(/р/g, 'r')
        .replace(/с/g, 's')
        .replace(/т/g, 't')
        .replace(/у/g, 'u')
        .replace(/ф/g, 'f')
        .replace(/х/g, 'h')
        .replace(/ц/g, 'ts')
        .replace(/ч/g, 'ch')
        .replace(/ш/g, 'sh')
        .replace(/щ/g, 'sch')
        .replace(/ъ/g, '')
        .replace(/ы/g, 'y')
        .replace(/ь/g, '')
        .replace(/э/g, 'e')
        .replace(/ю/g, 'yu')
        .replace(/я/g, 'ya');

    return transliterated
        .replace(/\s+/g, '-')         // пробелы на дефис
        .replace(/[^\w\-]+/g, '')     // удалить всё, кроме букв, цифр, дефиса
        .replace(/\-\-+/g, '-')       // двойные дефисы → одинарные
        .replace(/^-+/, '')           // убрать дефисы в начале
        .replace(/-+$/, '');          // убрать дефисы в конце
}

// Получение списка категорий
export async function GET() {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
}

// Создание новой категории
export async function POST(req: NextRequest) {
    const body = await req.json();
    const name = body.name?.trim();

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Проверка, существует ли уже категория с таким именем
    const existing = await prisma.category.findFirst({
        where: { name },
    });

    if (existing) return NextResponse.json(existing);

    const slug = slugify(name);

    const newCategory = await prisma.category.create({
        data: {
            name,
            slug,
        },
    });

    return NextResponse.json(newCategory);
}
