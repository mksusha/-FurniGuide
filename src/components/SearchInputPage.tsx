'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid'

export default function SearchInputPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get('q') || ''

    const [query, setQuery] = useState(initialQuery)

    useEffect(() => {
        setQuery(initialQuery)
    }, [initialQuery])

    const handleSearch = () => {
        const trimmed = query.trim()
        if (trimmed) {
            router.push(`/search?q=${encodeURIComponent(trimmed)}`)
        }
    }

    const handleClear = () => {
        setQuery('')
        // Убираем переход — просто очищаем текст в инпуте
    }

    return (
        <div className="max-w-4xl mx-auto mb-4">
            <div
                className="flex items-center bg-indigo-600/50 rounded-xl px-3 py-2
                   focus-within:ring-2 focus-within:ring-indigo-500 transition"
            >
                <button
                    type="button"
                    onClick={handleSearch}
                    className="text-white hover:text-indigo-200 transition"
                    aria-label="Поиск"
                >
                    <MagnifyingGlassIcon className="w-7 h-7" />
                </button>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Что вы ищете?"
                    className="flex-grow bg-transparent text-white placeholder-indigo-200
                     outline-none px-3 py-3 text-xl"
                    autoFocus
                />

                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-white hover:text-indigo-200 transition"
                        aria-label="Очистить поиск"
                    >
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                )}
            </div>
        </div>
    )
}
