import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Konsistenter Cookie-Name über die gesamte Anwendung hinweg
const AUTH_COOKIE_NAME = 'pyro_auth_token';

/**
 * Middleware für die Authentifizierungsprüfung und Weiterleitungen.
 * Nutzt das HttpOnly-Cookie, das vom NestJS-Server gesetzt wird.
 */
export function middleware(request: NextRequest) {
  // Auth-Status aus dem Cookie lesen
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const isAuthenticated = !!authCookie?.value;
  
  // Aktuelle Route analysieren
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isLoginRoute = request.nextUrl.pathname === '/auth/login';

  console.log(`MIDDLEWARE: ${request.nextUrl.pathname}, Authentifiziert: ${isAuthenticated}`);

  // 1. Geschützte Dashboard-Routen erfordern Authentifizierung
  if (isDashboardRoute && !isAuthenticated) {
    console.log('MIDDLEWARE: Nicht authentifiziert - Weiterleitung zu /auth/signin');
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // 2. Authentifizierte Benutzer auf Auth-Routen zum Dashboard weiterleiten
  // (außer für den Login-Endpunkt, den jeder besuchen darf)
  if (isAuthRoute && isAuthenticated && !isLoginRoute) {
    console.log('MIDDLEWARE: Bereits authentifiziert - Weiterleitung zum Dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 3. Allen anderen Anfragen erlauben, normal fortzufahren
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};