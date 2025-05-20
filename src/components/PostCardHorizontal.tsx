'use client';

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    FaTelegramPlane,
    FaPinterestP,
    FaTwitter,
    FaWhatsapp,
    FaLink,
    FaCheck,
    FaShareAlt,
} from "react-icons/fa";

type PostCardProps = {
    post: {
        id: string;
        slug: string;
        title: string;
        subtitle?: string | null;
        createdAt: string | Date;
        imageUrl?: string | null;
    };
    categoryName: string;
    siteUrl: string;
};

export default function PostCardHorizontal({ post, categoryName, siteUrl }: PostCardProps) {
    const [shareOpen, setShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
    const [menuStyles, setMenuStyles] = useState<React.CSSProperties>({});
    const shareButtonRef = useRef<HTMLButtonElement>(null);

    const postUrl = `${siteUrl}/post/${post.slug}`;

    useEffect(() => {
        const div = document.createElement("div");
        document.body.appendChild(div);
        setPortalContainer(div);

        return () => {
            document.body.removeChild(div);
        };
    }, []);

    useEffect(() => {
        if (!shareOpen || !shareButtonRef.current) return;

        const updatePosition = () => {
            const rect = shareButtonRef.current!.getBoundingClientRect();
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;
            const menuHeight = 240;
            const viewportHeight = window.innerHeight;

            const positionFromBottom = rect.bottom + menuHeight > viewportHeight;

            const top = positionFromBottom
                ? scrollY + rect.top - menuHeight - 8
                : scrollY + rect.bottom + 8;

            setMenuStyles({
                position: 'absolute',
                top: top,
                left: scrollX + rect.right - 240,
                zIndex: 9999,
            });
        };

        updatePosition();
        window.addEventListener("scroll", updatePosition);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition);
            window.removeEventListener("resize", updatePosition);
        };
    }, [shareOpen]);

    useEffect(() => {
        if (shareOpen) setCopied(false);
    }, [shareOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                shareButtonRef.current &&
                !shareButtonRef.current.contains(event.target as Node) &&
                portalContainer &&
                !portalContainer.contains(event.target as Node)
            ) {
                setShareOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [portalContainer]);

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopied(true);
    };

    const shareMenu = (
        <div
            className="w-60 bg-white rounded-lg p-3 shadow-2xl border border-gray-200"
            style={menuStyles}
        >
            <button
                onClick={() => copyToClipboard(postUrl)}
                className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-indigo-50 w-full text-gray-700"
                type="button"
            >
                {copied ? <FaCheck size={18} className="text-indigo-600" /> : <FaLink size={18} />}
                <span>{copied ? "Скопировано" : "Копировать ссылку"}</span>
            </button>

            <a
                href={`https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-indigo-50 mt-1 text-gray-700"
            >
                <FaTelegramPlane size={18} />
                <span>Telegram</span>
            </a>

            <a
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(postUrl)}&description=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-indigo-50 mt-1 text-gray-700"
            >
                <FaPinterestP size={18} />
                <span>Pinterest</span>
            </a>

            <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-indigo-50 mt-1 text-gray-700"
            >
                <FaTwitter size={18} />
                <span>Twitter</span>
            </a>

            <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-indigo-50 mt-1 text-gray-700"
            >
                <FaWhatsapp size={18} />
                <span>WhatsApp</span>
            </a>
        </div>
    );

    return (
        <Link
            href={`/post/${post.slug}`}
            className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 bg-sidebar p-4 md:p-6 rounded-xl border border-[var(--border)] transition-colors duration-300 ease-in-out hover:bg-sidebar/90 hover:shadow-sm relative  mx-auto"
        >
            <div className="flex-1 flex flex-col justify-between w-full">
                <div className="inline-block mb-3 rounded-full bg-indigo-600/50 px-3 py-1.5 font-medium text-white text-sm w-fit">
                    {categoryName}
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 ">
                    {post.title}
                </h3>

                <p className="mt-3 text-base text-gray-600 line-clamp-3">
                    {post.subtitle ?? "Без описания"}
                </p>

                <div className="flex items-center mt-4">
                    <time
                        className="text-sm text-gray-500"
                        dateTime={new Date(post.createdAt).toISOString()}
                    >
                        {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                    </time>

                    <button
                        onClick={(e) => {
                            e.preventDefault(); // предотвратить переход по ссылке
                            setShareOpen((prev) => !prev);
                        }}
                        aria-label="Поделиться"
                        className="text-gray-500 ml-4  hover:text-indigo-600 transition-colors duration-200"
                        type="button"
                        ref={shareButtonRef}
                    >
                        <FaShareAlt size={20} />
                    </button>
                </div>
            </div>

            {post.imageUrl && (
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full md:w-56 h-40 object-cover rounded-lg flex-shrink-0"
                />
            )}

            {shareOpen && portalContainer && createPortal(shareMenu, portalContainer)}
        </Link>
    );
}
