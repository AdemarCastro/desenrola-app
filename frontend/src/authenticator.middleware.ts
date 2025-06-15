import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rotasPublicas = [
  '/',
  '/login',
];

export function authenticator(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  if (rotasPublicas.includes(pathname)) {
    if (token && pathname === '/login') {
      return NextResponse.redirect(new URL('/projetos', request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const urlLogin = new URL('/login', request.url);
    urlLogin.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(urlLogin);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg)).*)',
  ],
};