import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const pathname = req.nextUrl.pathname;

    // Не редиректим, если уже на странице входа, чтобы избежать цикла
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    // Защищаем /admin и вложенные пути (кроме /admin/login)
    if (!token && pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
