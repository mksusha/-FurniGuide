'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

export default function FullWidthSearch({ onSearch }: { onSearch?: () => void }) {
    const [query, setQuery] = useState('')
    const router = useRouter()

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`)
            if (onSearch) onSearch() // Закрыть меню, если колбэк передан
        }
    }

    return (
        <div className="w-full">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Поиск по сайту..."
                    className="w-full px-4 py-2 text-sm focus:outline-none"
                    autoFocus
                />
                <button
                    onClick={handleSearch}
                    className="px-3 text-gray-500 hover:text-black transition"
                    aria-label="Найти"
                >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
