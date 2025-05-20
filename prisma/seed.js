import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const authorsData = {
    "Автор 3": {
        name: "Автор 3",
        bio: "Пишет о детской мебели и безопасности.",
        avatarUrl: "https://example.com/avatar-kid3.jpg",
        slug: "avtor-3",
    },
    "Автор 4": {
        name: "Автор 4",
        bio: "Эксперт по эргономике детской мебели.",
        avatarUrl: "https://example.com/avatar-kid4.jpg",
        slug: "avtor-4",
    },
};


const kidsPosts = [
    {
        title: "Уют в детской: как выбрать мебель для ребенка",
        subtitle: "Практичные советы для родителей",
        slug: "uyut-v-detskoy",
        content: "Полный гид по выбору безопасной и функциональной мебели для детской комнаты.",
        imageUrl: "https://example.com/images/post1.jpg",
        authorName: "Автор 3",
    },
    {
        title: "5 идей для организации хранения игрушек",
        subtitle: "Организованное пространство — счастливый ребенок",
        slug: "khranenie-igrushek",
        content: "Как обустроить удобное место для хранения игрушек, не теряя эстетики.",
        imageUrl: "https://example.com/images/post2.jpg",
        authorName: "Автор 4",
    },
    {
        title: "Выбор кровати для малыша: на что обратить внимание",
        subtitle: "Безопасность и комфорт прежде всего",
        slug: "vybor-krovati",
        content: "Рассматриваем варианты кроватей для разных возрастов и помещений.",
        imageUrl: "https://example.com/images/post3.jpg",
        authorName: "Автор 3",
    },
    {
        title: "Как обустроить рабочее место школьника",
        subtitle: "Эргономика и стиль",
        slug: "rabochee-mesto-shkolnika",
        content: "Подбираем стол, стул и освещение для продуктивных занятий.",
        imageUrl: "https://example.com/images/post4.jpg",
        authorName: "Автор 4",
    },
    {
        title: "Современные материалы в детской мебели",
        subtitle: "Безопасность и экология",
        slug: "materialy-detskoy-mebeli",
        content: "Что важно знать о материалах и покрытиях, используемых в мебели для детей.",
        imageUrl: "https://example.com/images/post5.jpg",
        authorName: "Автор 3",
    },
];

async function main() {
    const kidsCategory = await prisma.category.findUnique({
        where: { slug: "detskaya-mebel" },
    });

    if (!kidsCategory) {
        throw new Error("Категория 'Детская мебель' не найдена");
    }

    for (const post of kidsPosts) {
        let authorId = null;

        if (post.authorName) {
            const authorData = authorsData[post.authorName];

            const author = await prisma.author.upsert({
                where: { name: post.authorName },
                update: {},
                create: authorData,
            });

            authorId = author.id;
        }

        await prisma.post.upsert({
            where: { slug: post.slug },
            update: {},
            create: {
                title: post.title,
                subtitle: post.subtitle,
                slug: post.slug,
                content: post.content,
                imageUrl: post.imageUrl,
                publishedAt: new Date(),
                categoryId: kidsCategory.id,
                ...(authorId && { authorId }),
            },
        });
    }

    console.log("Посты для 'Детская мебель' добавлены ✅");
}

main()
    .catch((e) => {
        console.error("❌ Ошибка при сидировании:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
