import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth/');
  const isLoginRoute = request.nextUrl.pathname === '/login';
  const isApiDataRoute = request.nextUrl.pathname === '/api/data';
  
  const session = request.cookies.get('session')?.value;
  
  if (!session && !isAuthRoute && !isLoginRoute && !isApiDataRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (session && isLoginRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
