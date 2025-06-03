'use client'

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
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

export default function PostCard({ post, categoryName, siteUrl }: PostCardProps) {
    const pathname = usePathname();
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
        <div className="flex flex-col space-y-4 bg-sidebar p-4 rounded-xl border border-[var(--border)] transition-colors duration-300 ease-in-out hover:bg-sidebar/90 hover:shadow-sm relative">

            {pathname === "/" && (
                <div className="inline-block mb-3 rounded-full bg-indigo-600/50 px-2 py-1.5 font-medium text-white text-sm w-fit absolute top-4 left-4 z-10">
                    {categoryName}
                </div>
            )}

            <div className={pathname === "/" ? "pt-8 flex-1" : "flex-1"}>
                <Link href={`/post/${post.slug}`}>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mt-2">{post.title}</h3>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                            {post.subtitle ?? "Без описания"}
                        </p>
                    </div>

                    {post.imageUrl && (
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            loading="lazy"
                            className="rounded-lg aspect-video object-cover mt-4"
                        />
                    )}

                </Link>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mt-2 relative">
                <time dateTime={new Date(post.createdAt).toISOString()}>
                    {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                </time>

                <button
                    onClick={() => setShareOpen(prev => !prev)}
                    aria-label="Поделиться"
                    className="text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                    type="button"
                    ref={shareButtonRef}
                >
                    <FaShareAlt size={16} />
                </button>
            </div>

            {shareOpen && portalContainer && createPortal(shareMenu, portalContainer)}
        </div>
    );
}
