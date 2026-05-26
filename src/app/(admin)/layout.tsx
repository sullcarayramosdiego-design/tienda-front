'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { AdminSidebar } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

// Componente dinámico de Breadcrumb para el panel de administración
function AdminBreadcrumb() {
  const pathname = usePathname();
  
  // Dividir la ruta en segmentos y filtrar vacíos
  const segments = pathname.split('/').filter(Boolean);
  
  // Mapeo de términos a etiquetas legibles
  const labelMap: Record<string, string> = {
    admin: 'Inicio',
    analytics: 'Analítica y Reportes',
    orders: 'Pedidos y Despachos',
    inventory: 'Inventario 3D',
    users: 'Cuentas de Usuario',
    finance: 'Finanzas',
    products: 'Catálogo de Productos',
    account: 'Mi Cuenta',
    settings: 'Configuración',
  };

  return (
    <nav className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground select-none">
      <Link 
        href="/admin" 
        className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      
      {segments.map((segment, index) => {
        // Omitir el primer segmento "admin" para evitar duplicados si hay más segmentos
        if (segment.toLowerCase() === 'admin' && index === 0 && segments.length > 1) {
          return null;
        }
        
        const href = '/' + segments.slice(0, index + 1).join('/');
        const label = labelMap[segment.toLowerCase()] || segment.charAt(0).toUpperCase() + segment.slice(1);
        const isLast = index === segments.length - 1;

        return (
          <div key={href} className="flex items-center gap-1.5 min-w-0">
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
            {isLast ? (
              <span className="font-extrabold text-foreground truncate tracking-tight">
                {label}
              </span>
            ) : (
              <Link 
                href={href} 
                className="hover:text-foreground transition-colors truncate"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAdmin>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="min-w-0 overflow-hidden flex flex-col">
          <div className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4 min-w-0 pr-4">
              <SidebarTrigger className="-ml-1" />
              <AdminBreadcrumb />
            </div>
          </div>
          <main id="admin-main-content" className="flex-1 w-full overflow-auto p-6 pt-4">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
