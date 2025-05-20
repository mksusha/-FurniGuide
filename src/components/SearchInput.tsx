'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid'

export default function SearchInput() {
    const [isActive, setIsActive] = useState(false)
    const [query, setQuery] = useState('')
    const router = useRouter()

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        }
    }

    const handleToggle = () => {
        setIsActive(false)
        setQuery('')
    }

    return (
        <div className="relative flex justify-end w-full">
            <div className="flex items-center space-x-2 transition-all duration-300">
                {isActive ? (
                    <>
                        {/* Кнопка поиска — слева от инпута */}
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="text-gray-500 hover:text-black transition"
                            aria-label="Найти"
                        >
                            <MagnifyingGlassIcon className="w-5 h-5" />
                        </button>

                        {/* Инпут по центру */}
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Поиск..."
                            className="transition-all duration-300 border border-gray-300 rounded-md px-3 py-1 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                        />

                        {/* Крестик — справа */}
                        <button
                            type="button"
                            onClick={handleToggle}
                            className="text-gray-500 hover:text-black transition"
                            aria-label="Закрыть поиск"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </>
                ) : (
                    // Только иконка поиска, которая активирует режим
                    <button
                        type="button"
                        onClick={() => setIsActive(true)}
                        className="text-gray-500 hover:text-black transition"
                        aria-label="Открыть поиск"
                    >
                        <MagnifyingGlassIcon className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>
    )
}
