'use client';
import { useState } from 'react';
import { Dialog, DialogPanel, } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (<header className="bg-white border-b border-gray-200">
            <nav aria-label="Главная навигация" className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8">
                {/* Логотип слева */}
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Ваша Компания</span>
                        <img alt="Логотип" src="/favicon.ico" className="h-12 w-auto"/>
                    </a>
                </div>

                {/* Центр - меню с категориями */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-center space-x-12">
                    <a href="#about" className="text-sm font-semibold text-gray-900 hover:text-indigo-600">
                        О проекте
                    </a>
                    <a href="#rules" className="text-sm font-semibold text-gray-900 hover:text-indigo-600">
                        Правила
                    </a>
                    <a href="#contacts" className="text-sm font-semibold text-gray-900 hover:text-indigo-600">
                        Контакты
                    </a>
                </div>

                {/* Поиск справа */}
                <div className="flex lg:flex-1 lg:justify-end">
                    <button type="button" className="text-gray-500 hover:text-black transition" aria-label="Поиск">
                        <MagnifyingGlassIcon className="w-6 h-6"/>
                    </button>
                </div>

                {/* Кнопка мобильного меню */}
                <div className="flex lg:hidden">
                    <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" aria-label="Открыть главное меню">
                        <Bars3Icon className="w-6 h-6" aria-hidden="true"/>
                    </button>
                </div>
            </nav>

            {/* Мобильное меню */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10 bg-black/30" aria-hidden="true"/>
                <DialogPanel className="fixed inset-y-0 right-0 z-20 w-full max-w-sm overflow-y-auto bg-white px-6 py-6 sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Ваша Компания</span>
                            <img alt="Логотип" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" className="h-8 w-auto"/>
                        </a>

                        <button type="button" onClick={() => setMobileMenuOpen(false)} className="-m-2.5 rounded-md p-2.5 text-gray-700" aria-label="Закрыть меню">
                            <XMarkIcon className="w-6 h-6" aria-hidden="true"/>
                        </button>
                    </div>

                    <div className="mt-6 space-y-6">
                        <a href="#about" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
                            О проекте
                        </a>
                        <a href="#rules" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
                            Правила
                        </a>
                        <a href="#contacts" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
                            Контакты
                        </a>
                        <button type="button" className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                            Поиск
                        </button>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>);
}
