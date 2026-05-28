'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

/**
 * Componente para proteger rutas que requieren autenticación
 * 
 * @example
 * // Ruta que requiere autenticación
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * // Ruta que requiere rol de administrador
 * <ProtectedRoute requireAdmin>
 *   <AdminPanel />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Si no está autenticado, redirigir al login
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Si requiere admin y no lo es, redirigir al inicio
      if (requireAdmin && !isAdmin) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isAdmin, loading, requireAdmin, redirectTo, router]);

  // Mostrar loading mientras verifica
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado o no tiene permisos, no mostrar nada
  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  // Usuario autenticado y con permisos correctos
  return <>{children}</>;
}

/**
 * HOC para proteger páginas completas
 * 
 * @example
 * export default withAuth(DashboardPage);
 * export default withAuth(AdminPage, { requireAdmin: true });
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { requireAdmin?: boolean; redirectTo?: string }
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Componente para rutas públicas (redirige si ya está autenticado)
 * Útil para páginas de login/register
 * 
 * @example
 * <PublicRoute redirectTo="/catalog">
 *   <LoginPage />
 * </PublicRoute>
 */
export function PublicRoute({
  children,
  redirectTo = '/catalog',
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si está autenticado, no mostrar nada (está redirigiendo)
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
