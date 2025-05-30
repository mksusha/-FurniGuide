import { prisma } from './src/lib/prisma.js';

async function getPosts() {
    return prisma.post.findMany({
        select: {
            slug: true,
            updatedAt: true,
        },
    });
}

async function getCategories() {
    return prisma.category.findMany({
        select: {
            slug: true,
        },
    });
}

export default {
    siteUrl: 'https://furni-guide.vercel.app',
    generateRobotsTxt: true,
    changefreq: 'daily',
    exclude: ['/404', '/500'],
    robotsTxtOptions: {
        policies: [{ userAgent: '*', allow: '/' }],
    },
    additionalPaths: async () => {
        const posts = await getPosts();
        const categories = await getCategories();

        const postPaths = posts.map(post => ({
            loc: `/posts/${post.slug}`,
            lastmod: post.updatedAt ? post.updatedAt.toISOString() : undefined,
        }));

        const categoryPaths = categories.map(cat => ({
            loc: `/category/${cat.slug}`,
        }));

        return [...postPaths, ...categoryPaths];
    },
};
