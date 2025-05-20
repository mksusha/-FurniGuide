import { prisma } from "@/lib/prisma";

async function main() {
    // Создаём или получаем автора
    const authorName = "Марина Петрова";
    const authorSlug = "marina-petrova";

    const author = await prisma.author.upsert({
        where: { slug: authorSlug },
        update: {},
        create: {
            name: authorName,
            slug: authorSlug,
            bio: "Эксперт по детской мебели, делится полезными советами и идеями.",
            avatarUrl: "https://example.com/avatar-marina.jpg",
        },
    });

    const kidsCategory = await prisma.category.findUnique({
        where: { slug: "detskaya-mebel" },
    });

    if (!kidsCategory) {
        throw new Error("Категория 'Детская мебель' не найдена");
    }

    const samplePosts = [
        {
            title: "Уют в детской: как выбрать мебель для ребенка",
            subtitle: "Практичные советы для родителей",
            content: "Полный гид по выбору безопасной и функциональной мебели для детской комнаты.",
            imageUrl: "https://example.com/images/post1.jpg",
            slug: "uyut-v-detskoy",
        },
        {
            title: "5 идей для организации хранения игрушек",
            subtitle: "Организованное пространство — счастливый ребенок",
            content: "Как обустроить удобное место для хранения игрушек, не теряя эстетики.",
            imageUrl: "https://example.com/images/post2.jpg",
            slug: "khranenie-igrushek",
        },
        {
            title: "Выбор кровати для малыша: на что обратить внимание",
            subtitle: "Безопасность и комфорт прежде всего",
            content: "Рассматриваем варианты кроватей для разных возрастов и помещений.",
            imageUrl: "https://example.com/images/post3.jpg",
            slug: "vybor-krovati",
        },
        {
            title: "Как обустроить рабочее место школьника",
            subtitle: "Эргономика и стиль",
            content: "Подбираем стол, стул и освещение для продуктивных занятий.",
            imageUrl: "https://example.com/images/post4.jpg",
            slug: "rabochee-mesto-shkolnika",
        },
        {
            title: "Современные материалы в детской мебели",
            subtitle: "Безопасность и экология",
            content: "Что важно знать о материалах и покрытиях, используемых в мебели для детей.",
            imageUrl: "https://example.com/images/post5.jpg",
            slug: "materialy-detskoy-mebeli",
        },
    ];

    for (const post of samplePosts) {
        await prisma.post.upsert({
            where: { slug: post.slug },
            update: {},
            create: {
                ...post,
                categoryId: kidsCategory.id,
                authorId: author.id,
                createdAt: new Date(),
                publishedAt: new Date(),
            },
        });
    }

    console.log("Посты для 'Детская мебель' с автором добавлены");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
