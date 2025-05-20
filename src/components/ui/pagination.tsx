import * as React from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

interface PaginationProps extends React.ComponentProps<"nav"> {
    totalPages: number;
    currentPage: number;
    basePath: string;
    query?: Record<string, string>; // <-- сюда передаем дополнительные параметры (например, q)
}

function buildHref(basePath: string, query: Record<string, string>, page: number) {
    // Создаем новый объект с параметрами + page
    const params = new URLSearchParams({ ...query, page: String(page) });
    return `${basePath}?${params.toString()}`;
}

function Pagination({
                        totalPages,
                        currentPage,
                        basePath,
                        query = {},
                        className,
                        ...props
                    }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav
            role="navigation"
            aria-label="pagination"
            className={cn("mx-auto flex w-full justify-center", className)}
            {...props}
        >
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            href={buildHref(basePath, query, currentPage - 1)}
                        />
                    </PaginationItem>
                )}

                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={buildHref(basePath, query, page)}
                            isActive={page === currentPage}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext href={buildHref(basePath, query, currentPage + 1)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </nav>
    );
}

function PaginationContent({
                               className,
                               ...props
                           }: React.ComponentProps<"ul">) {
    return (
        <ul
            className={cn("flex flex-row items-center gap-1", className)}
            {...props}
        />
    );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
    return <li {...props} />;
}

type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
    React.ComponentProps<"a">;

function PaginationLink({
                            className,
                            isActive,
                            size = "icon",
                            ...props
                        }: PaginationLinkProps) {
    return (
        <a
            aria-current={isActive ? "page" : undefined}
            className={cn(
                buttonVariants({
                    variant: isActive ? "outline" : "ghost",
                    size,
                }),
                className
            )}
            {...props}
        />
    );
}

function PaginationPrevious({
                                className,
                                ...props
                            }: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label="Previous page"
            size="default"
            className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
            {...props}
        >
            <ChevronLeftIcon />
            <span className="hidden sm:block">Назад</span>
        </PaginationLink>
    );
}

function PaginationNext({
                            className,
                            ...props
                        }: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label="Next page"
            size="default"
            className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
            {...props}
        >
            <span className="hidden sm:block">Вперёд</span>
            <ChevronRightIcon />
        </PaginationLink>
    );
}

function PaginationEllipsis({
                                className,
                                ...props
                            }: React.ComponentProps<"span">) {
    return (
        <span
            aria-hidden
            className={cn("flex size-9 items-center justify-center", className)}
            {...props}
        >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
    );
}

export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
};
