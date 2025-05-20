"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/Footer";
import FurnitureFeatureSection from "@/components/FurnitureFeatureSection";
import PostCard from "@/components/PostCard";
import PostCardHorizontal from "@/components/PostCardHorizontal";

const POSTS_PER_PAGE = 9;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  category: Category;
  createdAt: Date;
}

interface HomePageClientProps {
  initialPosts: Post[];
  initialCategories: Category[];
}

export default function HomePageClient({ initialPosts, initialCategories }: HomePageClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPosts.length === POSTS_PER_PAGE);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const loadMorePosts = async () => {
    if (loading) return;
    setLoading(true);
    const nextPage = page + 1;

    try {
      const res = await fetch(`/api/posts?page=${nextPage}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data: Post[] = await res.json();

      setPosts((prevPosts) => [...prevPosts, ...data]);
      setPage(nextPage);

      if (data.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }

      // Плавная прокрутка вниз после добавления новых постов
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error("Ошибка при загрузке постов:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex flex-col">
        <Header categories={categories} />

        <div className="flex flex-1 flex-col md:flex-row pt-14 overflow-hidden">
          <div className="overflow-y-auto md:h-screen md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
            <AppSidebar categories={categories} />
          </div>

          {/* Добавляем ref и фиксируем min-h, чтобы уменьшить скачки */}
          <main
              ref={containerRef}
              className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col min-h-[800px]"
          >
            <FurnitureFeatureSection />

            <section className="mt-16 w-11/12 m-auto space-y-8 flex flex-col">
              <h2 className="text-2xl text-center font-bold">Последние новости</h2>

              {/* Вертикальные карточки — первые 6 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(0, 6).map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        categoryName={post.category.name}
                        siteUrl="https://example.com"
                    />
                ))}
              </div>

              {/* Горизонтальные карточки — следующие 3 */}
              <div className="space-y-6">
                {posts.slice(6, 9).map((post) => (
                    <PostCardHorizontal
                        key={post.id}
                        post={post}
                        categoryName={post.category.name}
                        siteUrl="https://example.com"
                    />
                ))}
              </div>

              {/* После 9 карточек — еще 6 вертикальных и 3 горизонтальных */}
              {posts.length > 9 && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.slice(9, 15).map((post) => (
                          <PostCard
                              key={post.id}
                              post={post}
                              categoryName={post.category.name}
                              siteUrl="https://example.com"
                          />
                      ))}
                    </div>
                    <div className="space-y-6 mt-6">
                      {posts.slice(15, 18).map((post) => (
                          <PostCardHorizontal
                              key={post.id}
                              post={post}
                              categoryName={post.category.name}
                              siteUrl="https://example.com"
                          />
                      ))}
                    </div>
                  </>
              )}

              {/* Кнопка "Показать ещё" */}
              {hasMore && (
                  <div className="self-center ">
                    <button
                        onClick={loadMorePosts}
                        disabled={loading}
                        className="border border-indigo-600 text-indigo-600 bg-white px-6 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition-colors duration-300 flex items-center justify-center min-w-[140px] min-h-[40px]"
                    >
                      {loading ? (
                          <>
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                              <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                              ></circle>
                              <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                            Загрузка...
                          </>
                      ) : (
                          "Показать ещё"
                      )}
                    </button>

                  </div>
              )}
            </section>
          </main>
        </div>

        <Footer/>
      </div>
  );
}