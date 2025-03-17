import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token');

    // 如果是编辑页面且没有有效令牌，则重定向到首页
    if (request.nextUrl.pathname.startsWith('/edit/') &&
        (!token || token.value !== process.env.NEXT_PUBLIC_ACCESS_TOKEN)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/edit/:path*'
};