'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogPanel,
} from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import SearchInput from './SearchInput'

type Category = {
    id: string;
    name: string;
    slug: string;
}

type HeaderProps = {
    categories: Category[];
}

export default function Header({ categories }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="bg-sidebar fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
            <nav className="mx-auto flex  items-center justify-between px-4 py-2 lg:px-8">
                {/* Логотип максимально слева */}
                <div className="flex flex-1">
                    <a href="/" className="flex items-center space-x-2">
                        <img alt="Логотип" src="/favicon.ico" className="h-10 w-auto" />
                        <span className="text-lg font-semibold text-gray-900 hidden sm:inline">FurniGuide</span>
                    </a>
                </div>

                {/* Поиск максимально справа */}
                <div className="hidden lg:flex flex-1 justify-end ">
                    <div className="w-80">
                        <SearchInput />
                    </div>
                </div>

                {/* Мобильная кнопка */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        aria-label="Открыть меню"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            {/* Мобильное меню */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10 bg-black/30" aria-hidden="true" />
                <DialogPanel className="fixed inset-y-0 right-0 z-20 w-full max-w-sm overflow-y-auto bg-white px-6 py-6 sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="/" className="-m-1.5 p-1.5">
                            <img alt="Логотип" src="/favicon.ico" className="h-8 w-auto" />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            aria-label="Закрыть меню"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Поиск первым */}
                    <div className="mt-6">
                        <SearchInput />
                    </div>

                    {/* Навигация и категории */}
                    <div className="mt-6 space-y-6">

                        <div className="border-t pt-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Категории</h3>
                            <ul className="space-y-2">
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <a
                                            href={`/category/${cat.slug}`}
                                            className="block text-base font-medium text-gray-900 hover:text-indigo-600"
                                        >
                                            {cat.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
