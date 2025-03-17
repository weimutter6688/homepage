import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 从 localStorage 获取令牌
    const token = request.cookies.get('auth_token');

    // 如果是编辑页面且未认证，重定向到首页
    if (request.nextUrl.pathname.startsWith('/edit/') &&
        (!token || token.value !== process.env.NEXT_PUBLIC_ACCESS_TOKEN)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/edit/:path*'
};