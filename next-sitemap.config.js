/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://furni-guide.vercel.app',
    generateRobotsTxt: true,
    changefreq: 'daily', // ≤ 24ч
    exclude: ['/404', '/500'], // исключаем ошибки
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
            },
        ],
    },
};
