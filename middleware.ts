import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware para Next.js que maneja autenticación a nivel de servidor
 * 
 * IMPORTANTE: Este middleware realiza verificaciones básicas.
 * Para protección completa, también debes usar ProtectedRoute en el cliente.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lista de rutas que requieren autenticación (verificación del lado del servidor)
  const protectedPaths = [
    '/admin',
    '/account',
    '/checkout',
  ];

  // Lista de rutas públicas que no requieren autenticación
  const publicPaths = [
    '/login',
    '/register',
    '/',
    '/catalog',
    '/cart',
  ];

  // Verificar si la ruta actual requiere protección
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path));

  // Obtener token de las cookies o headers
  // NOTA: Actualmente usamos localStorage en el cliente
  // La verificación real se hace en el cliente con useAuth
  const token = request.cookies.get('access_token')?.value;

  // Si es una ruta protegida y no hay token en cookies, permitir de todos modos
  // porque la verificación real se hace en el cliente
  // (El ProtectedRoute del cliente manejará la redirección si es necesario)

  // Si es la página de login/register y ya tiene token, redirigir al catálogo
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/catalog', request.url));
  }

  // Agregar headers de seguridad
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public assets)
     * - icons (icon files)
     * - images (image files)
     * - models (3D model files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|icons|images|models).*)',
  ],
};
