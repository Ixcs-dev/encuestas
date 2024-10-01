import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirigir si no hay sesión
  if (pathname.startsWith('/dashboard') && !request.cookies.get('session')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next(); // Permite continuar
}

export const config = {
  matcher: ['/dashboard/:path*'], // Solo aplica a las rutas del dashboard
};
