'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Helper to parse route path segments and generate dynamic localized breadcrumbs
  const getBreadcrumbs = () => {
    const items = [{ label: 'Inicio', href: '/' }];
    
    if (pathname === '/') return items;
    
    const segments = pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      let label = segment;
      // Localize segments into Spanish
      if (segment === 'catalog') label = 'Catálogo 3D';
      else if (segment === 'cart') label = 'Mi Carrito';
      else if (segment === 'wishlist') label = 'Favoritos';
      else if (segment === 'account') label = 'Mi Perfil';
      else if (segment === 'orders') label = 'Mis Pedidos';
      else if (segment === 'loyalty') label = 'Puntos Club 3D';
      else if (segment === 'checkout') label = 'Pasarela de Pago';
      
      // Fallback for dynamic UUID routes
      if (segment.match(/^[a-f0-9-]{36}$/i)) {
        label = 'Detalle de Producto';
      }
      
      items.push({ label, href: currentPath });
    });
    
    return items;
  };

  if (isAuthenticated) {
    const breadcrumbs = getBreadcrumbs();
    
    return (
      <SidebarProvider>
        {/* Unified Shadcn UI Left Customer Sidebar */}
        <Sidebar />
        
        {/* Right Content Panel */}
        <SidebarInset className="overflow-x-hidden flex flex-col min-h-screen">
          {/* Dynamic Top bar containing the Sidebar trigger & Breadcrumbs */}
          <div className="sticky top-0 z-20 flex h-14 shrink-0 items-center bg-background/95 px-4 backdrop-blur border-b border-primary/5 gap-2">
            <SidebarTrigger className="-ml-1 text-primary cursor-pointer active:scale-95 animate-fade-in" />
            
            {/* Dynamic Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-muted-foreground ml-3 select-none">
              {breadcrumbs.map((item, idx, arr) => (
                <React.Fragment key={item.href}>
                  {idx > 0 && <span className="text-muted-foreground/30 font-normal">/</span>}
                  {idx === arr.length - 1 ? (
                    <span className="text-foreground font-black">{item.label}</span>
                  ) : (
                    <Link href={item.href} className="hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Main child viewport with premium spacing */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-4 w-full max-w-7xl mx-auto">
            {children}
          </main>
          
          {/* Minimalist Client Footer */}
          <footer className="py-6 border-t border-primary/5 bg-card/25 text-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold">
              &copy; {new Date().getFullYear()} TIENDA 3D EXPERIENCE. Todos los derechos reservados.
            </p>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Fallback layout for guest visitors (Traditional Top Header NavBar)
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
