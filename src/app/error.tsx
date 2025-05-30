'use client'

import { useEffect } from 'react'

export default function GlobalError({
                                        error,
                                        reset,
                                    }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html>
        <body className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h1 className="text-5xl font-bold text-indigo-600">500</h1>
        <p className="mt-4 text-xl text-gray-700">Что-то пошло не так</p>
        <p className="mt-2 text-gray-500">
            Произошла внутренняя ошибка на сервере. Попробуйте позже или обновите страницу.
        </p>
        <button
            onClick={() => reset()}
            className="mt-6 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
            Обновить страницу
        </button>
        </body>
        </html>
    )
}
