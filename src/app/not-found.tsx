import Link from "next/link";
import FullWidthSearch from '@/components/FullWidthSearch'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12 text-center">
            <h1 className="text-6xl font-bold text-indigo-600">404</h1>
            <p className="mt-4 text-xl text-gray-700">Страница не найдена</p>
            <p className="mt-2 text-gray-500">
                Возможно, вы ввели неправильный адрес или страница была удалена.
            </p>

            {/* Поиск */}
            <div className="mt-6 w-full max-w-md">
                <FullWidthSearch />
            </div>

            {/* Кнопки */}
            <div className="mt-6 flex gap-4">
                <Link href="/">
                    <button className="rounded-md bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition">
                        На главную
                    </button>
                </Link>

            </div>
        </div>
    );
}
