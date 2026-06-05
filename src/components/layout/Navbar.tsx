'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  };

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/catalog', label: 'Catálogo' },
    { href: '/mi-peru', label: 'Mi Perú' },
    { href: '/wishlist', label: 'Favoritos', icon: Heart },
  ];

  return (
    <nav className="hidden lg:flex sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <img 
            src="/images/logo1.png" 
            alt="Andean Vibes Logo" 
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Navegación Central */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive(link.href) ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(!isActive(link.href) && 'text-muted-foreground')}
                >
                  {Icon && <Icon className="h-4 w-4 mr-1" />}
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Barra de Búsqueda */}
        <div className="flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Acciones Derecha */}
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button size="sm" variant="outline" className="border-primary/30 hover:bg-primary/5">
              Iniciar Sesión
            </Button>
          </Link>
          
          <Link href="/register">
            <Button size="sm">
              Crear Cuenta
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
