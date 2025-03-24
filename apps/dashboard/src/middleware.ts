import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_KEY } from './lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  
  // If trying to access dashboard without a token, redirect to login
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  
  // If trying to access auth routes with a token, redirect to dashboard
  // Exception for the callback route which handles the token
  if (isAuthRoute && token && request.nextUrl.pathname !== '/auth/callback') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};