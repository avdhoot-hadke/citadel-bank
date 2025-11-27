import { NextResponse } from 'next/server';

export function middleware(request: any) {
  const token = request.cookies.get('token')?.value;

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/auth')) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};