import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "FurniGuide — Блог о мебели, интерьере и покупках",
    description: "FurniGuide — это ваш гид по мебельному миру. Обзоры, советы, тренды и подборки лучшей мебели с маркетплейсов вроде Ozon и Wildberries.",
    keywords: [
        "мебель", "интерьер", "дизайн", "дом", "купить мебель", "мебельный блог",
        "озон мебель", "wildberries мебель", "советы по мебели", "обзор мебели", "furniguide"
    ],
    authors: [{ name: "FurniGuide", url: "https://furniguide.ru" }],
    openGraph: {
        title: "FurniGuide — Блог о мебели и интерьере",
        description: "Лучшие советы по выбору мебели, обзоры товаров, тренды и лайфхаки. Мебель с маркетплейсов глазами экспертов.",
        url: "https://furniguide.ru",
        siteName: "FurniGuide",
        type: "website",
        locale: "ru_RU",
    },

    metadataBase: new URL("https://furniguide.ru"),
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
        <head>
            <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="font-nunito antialiased">
        {children}
        </body>
        </html>
    );
}
