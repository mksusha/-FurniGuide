// app/page.tsx
import Image from "next/image";
import Header from "../components/Header"; // импорт готового хедера
export default function Home() {
    return (<div>
            <Header /> {/* используем готовый хедер */}
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority/>
                <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                    <li className="mb-2 tracking-[-.01em]">
                        Get started by editing{" "}
                        <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                            src/app/page.tsx
                        </code>
                        .
                    </li>
                    <li className="tracking-[-.01em]">
                        Save and see your changes instantly.
                    </li>
                </ol>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                {/* ... как было */}
            </footer>
        </div>);
}
