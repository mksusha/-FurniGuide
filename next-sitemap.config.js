/** @type {import('next-sitemap').IConfig} */
const config = {
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
    outDir: './public',
};

export default config;
