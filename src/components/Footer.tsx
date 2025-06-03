import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t mt-2 text-sm text-gray-500 px-4 py-4 w-full lg:pl-64">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                {/* Логотип + название */}
                <Link href="/" className="flex items-center space-x-2">
                    <img
                        loading="lazy"
                        alt="Логотип сайта"
                        src="/favicon.ico"
                        className="h-8 w-8"
                    />

                    <span className="text-base font-semibold text-gray-900">
                        FurniGuide
                    </span>
                </Link>

                {/* Навигация */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                    {[
                        { href: "/about", label: "О проекте" },
                        { href: "/contacts", label: "Контакты" },
                        { href: "/rules", label: "Правила" },
                        { href: "/ads", label: "Реклама" },
                        { href: "/privacy", label: "Политика конфиденциальности" },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="px-2 py-1 rounded-lg hover:bg-sidebar hover:text-indigo-600/50 transition"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Копирайт */}
                <div className="text-center md:text-right">
                    © {new Date().getFullYear()} Все права защищены
                </div>
            </div>
        </footer>
    );
}
