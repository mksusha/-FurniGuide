/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://furni-guide.vercel.app',
    generateRobotsTxt: true,
    changefreq: 'daily',
    exclude: ['/404', '/500'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
            },
        ],
    },
    outDir: './public', // ← сюда добавил
};
