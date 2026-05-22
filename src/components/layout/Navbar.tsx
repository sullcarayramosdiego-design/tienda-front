'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">3D</span>
          </div>
          <span className="text-xl font-bold hidden sm:inline">E-Commerce 3D</span>
        </Link>

        {/* Navegación Central */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              className={cn(!isActive('/') && 'text-muted-foreground')}
            >
              Inicio
            </Button>
          </Link>
          <Link href="/catalog">
            <Button
              variant={isActive('/catalog') ? 'default' : 'ghost'}
              size="sm"
              className={cn(!isActive('/catalog') && 'text-muted-foreground')}
            >
              Catálogo
            </Button>
          </Link>
          <Link href="/wishlist">
            <Button
              variant={isActive('/wishlist') ? 'default' : 'ghost'}
              size="sm"
              className={cn(!isActive('/wishlist') && 'text-muted-foreground')}
            >
              <Heart className="h-4 w-4 mr-1" />
              Favoritos
            </Button>
          </Link>
        </div>

        {/* Barra de Búsqueda */}
        <div className="hidden lg:flex flex-1 max-w-sm mx-4">
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
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
            </Button>
          </Link>
          
          <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
          
          <Link href="/account">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link href="/login">
            <Button size="sm" className="hidden sm:inline-flex">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
