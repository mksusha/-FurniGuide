import { BookText, Sofa, TrendingUp } from "lucide-react";

export default function FurnitureBlogFeatures() {
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-center text-base font-semibold text-indigo-600">
                    Мебельный блог
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-center text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-4xl">
                    Всё о мебели в одном месте
                </p>

                {/* Grid без фиксированной высоты */}
                <div className="mt-8 sm:mt-5 grid gap-4 lg:grid-cols-3 lg:grid-rows-2 ">

                    {/* Левый блок */}
                    <div className="relative lg:row-span-2 flex flex-col bg-sidebar overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)] sm:min-h-[22rem] min-h-[16rem]">
                        <div className="px-8 pt-6 pb-2 sm:px-10">
                            <p className="text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                Широкий выбор категорий
                            </p>
                            <p className="mt-1 text-sm text-gray-600 max-lg:text-center">
                                От кухонных гарнитуров до офисной мебели — удобно искать статьи по нужной теме.
                            </p>
                        </div>
                        <div className="px-4 py-2 flex-1 flex items-center justify-center">
                            <img
                                className="object-contain h-full lg:max-h-70 max-h-50"
                                src="/images/2.png"
                                alt=""
                            />
                        </div>
                    </div>

                    {/* Центральная колонка */}
                    <div className="flex flex-col gap-4 lg:col-span-1 lg:row-span-2">

                        {/* Блок 2 */}
                        <div className="relative flex-1 flex flex-col bg-sidebar overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                            <div className="px-8 pt-6 sm:px-10">
                                <p className="text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                    Сотни полезных статей
                                </p>
                                <p className="mt-1 text-sm text-gray-600 max-lg:text-center">
                                    Регулярно публикуем статьи про тренды, выбор, уход и покупку мебели в Ozon, WB и других площадках.
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-4 py-6">
                                <BookText className="w-12 h-12 text-indigo-600" />
                                <Sofa className="w-12 h-12 text-indigo-600" />
                                <TrendingUp className="w-12 h-12 text-indigo-600" />
                            </div>
                        </div>

                        {/* Блок 3 */}
                        <div className="relative flex-1 flex flex-col bg-sidebar overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                            <div className="px-8 pt-6 sm:px-10">
                                <p className="text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                    Интеграции с маркетплейсами
                                </p>
                                <p className="mt-1 text-sm text-gray-600 max-lg:text-center">
                                    Сравниваем цены и подбираем товары с популярных платформ: Ozon, Wildberries и других.
                                </p>
                            </div>
                            <div className="flex-1 flex items-center justify-center gap-4 px-6 py-4">
                                {["/images/ozon.svg", "/images/w.png"].map((src, i) => (
                                    <div
                                        key={i}
                                        className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"
                                    >
                                        <img
                                            className="w-[150%] h-[150%] object-cover -m-2"
                                            src={src}
                                            alt={`Logo ${i}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Правый блок */}
                    <div className="relative lg:row-span-2 flex flex-col bg-sidebar overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-r-[calc(2rem+1px)] sm:min-h-[22rem] min-h-[16rem]">
                        <div className="px-8 pt-6 pb-2 sm:px-10">
                            <p className="text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                Идеи оформления интерьера
                            </p>
                            <p className="mt-1 text-sm text-gray-600 max-lg:text-center">
                                Подборки вдохновляющих интерьеров, советы по размещению мебели и созданию уюта в доме.
                            </p>
                        </div>
                        <div className="flex-1 flex justify-center items-center px-4 py-2">
                            <img
                                className="object-contain h-full lg:max-h-70 max-h-50 transform scale-x-[-1]"
                                src="/images/3.png"
                                alt="Интерьер"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
