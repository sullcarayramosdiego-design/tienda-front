'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingCart, 
  Menu, 
  Search, 
  Heart, 
  User as UserIcon, 
  LogOut, 
  ShoppingBag, 
  ChevronDown, 
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth';
import { CartDrawer } from '@/features/checkout';
import { NotificationBell } from './NotificationBell';
import { ThemeToggle } from './ThemeToggle';


interface HeaderProps {
  cartItemsCount?: number;
}

export function Header({ cartItemsCount = 0 }: HeaderProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll to make header sticky/compact with shadows
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  };

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/catalog', label: 'Catálogo' },
    ...(isAuthenticated ? [{ href: '/wishlist', label: 'Favoritos', icon: Heart }] : []),
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 border-b",
      scrolled 
        ? "bg-background/95 backdrop-blur-md shadow-md border-border/80 h-16" 
        : "bg-background/80 backdrop-blur-sm border-transparent h-20"
    )}>
      <div className="container mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img 
            src="/images/logo1.png" 
            alt="Andean Vibes Logo" 
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
 
        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "relative h-10 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
                    active 
                      ? "text-primary bg-primary/5 font-extrabold" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {Icon && <Icon className={cn("h-4 w-4 mr-1.5", active ? "text-primary" : "text-muted-foreground")} />}
                  <span>{link.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full animate-fade-in" />
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
 
        {/* BARRA DE BÚSQUEDA DESKTOP */}
        <div className="hidden lg:flex flex-1 max-w-xs mx-6">
          <div className="relative w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Buscar arte y cultura..."
              className="pl-10 h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-primary/40 focus-visible:bg-background transition-all"
            />
          </div>
        </div>
 
        {/* ACCIONES DERECHA */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Notificaciones Bell */}
          {isAuthenticated && <NotificationBell />}
          {/* Carrito Icono */}
          {isAuthenticated && <CartDrawer />}

          {/* Menú de Usuario / Autenticación */}
          <div className="hidden sm:block">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 flex items-center gap-2 px-2.5 rounded-xl border border-primary/5 hover:bg-muted/50 cursor-pointer">
                    <Avatar className="h-7 w-7 border border-primary/10">
                      <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary font-bold text-xs uppercase">
                        {`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-bold text-foreground max-w-[80px] truncate">{`${user.firstName} ${user.lastName}`}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl p-1.5 border-primary/5 shadow-xl bg-card/95 backdrop-blur-xl">
                  <DropdownMenuLabel className="px-2.5 py-2">
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-sm font-bold text-foreground leading-none">{`${user.firstName} ${user.lastName}`}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/5" />
                  <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 cursor-pointer focus:bg-primary/5">
                    <Link href="/account" className="flex w-full items-center gap-2 text-sm">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 cursor-pointer focus:bg-primary/5">
                    <Link href="/account/orders" className="flex w-full items-center gap-2 text-sm">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      Mis Pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/5" />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="rounded-lg px-2.5 py-2 cursor-pointer text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20 focus:text-destructive gap-2 text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="h-9 text-xs sm:text-sm font-semibold rounded-xl text-muted-foreground hover:text-foreground">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="h-9 px-4 text-xs sm:text-sm font-bold rounded-xl bg-primary hover:bg-primary/95 shadow-md shadow-primary/10">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Menú Móvil Hamburger Trigger */}
          <div className="md:hidden flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-11 w-11 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all cursor-pointer"
                  aria-label="Abrir menú"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-80 flex flex-col p-6 border-l border-primary/5 bg-card/95 backdrop-blur-xl">
                <SheetHeader className="px-0 pb-4 border-b border-primary/5">
                  <SheetTitle className="flex items-center gap-2.5 text-left">
                    <img 
                      src="/images/logo1.png" 
                      alt="Andean Vibes Logo" 
                      className="h-8 w-auto object-contain"
                    />
                  </SheetTitle>
                </SheetHeader>

                {/* Búsqueda en Móvil */}
                <div className="relative mt-6 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="search"
                    placeholder="Buscar arte y cultura..."
                    className="pl-10 h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-primary/40 focus-visible:bg-background"
                  />
                </div>

                {/* Enlaces de Navegación en Móvil */}
                <div className="flex flex-col gap-6 mt-8 flex-1">
                  <nav className="flex flex-col gap-1.5">
                    <h3 className="text-[10px] font-black text-muted-foreground tracking-widest uppercase px-3 mb-2">
                      Explorar
                    </h3>
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const active = isActive(link.href);
                      return (
                        <Link 
                          key={link.href} 
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold",
                            active
                              ? "bg-primary/10 text-primary font-bold shadow-sm"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          {Icon ? <Icon className="h-5 w-5 text-primary" /> : <ShoppingBag className="h-5 w-5 text-primary" />}
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Sección de Autenticación Móvil */}
                  <div className="mt-auto border-t border-primary/5 pt-6 pb-2">
                    {isAuthenticated && user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 px-3">
                          <Avatar className="h-10 w-10 border border-primary/10 shadow-sm">
                            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary font-bold text-sm uppercase">
                              {`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col space-y-0.5">
                            <span className="text-sm font-bold text-foreground leading-none">{`${user.firstName} ${user.lastName}`}</span>
                            <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{user.email}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start rounded-xl h-10 px-4 gap-2 text-sm font-semibold">
                              <UserIcon className="h-4.5 w-4.5 text-muted-foreground" />
                              Mi Perfil
                            </Button>
                          </Link>
                          <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start rounded-xl h-10 px-4 gap-2 text-sm font-semibold">
                              <ShoppingBag className="h-4.5 w-4.5 text-muted-foreground" />
                              Mis Pedidos
                            </Button>
                          </Link>
                          <Button 
                            onClick={() => {
                              logout();
                              setMobileMenuOpen(false);
                            }}
                            variant="ghost" 
                            className="w-full justify-start rounded-xl h-10 px-4 gap-2 text-sm font-bold text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                          >
                            <LogOut className="h-4.5 w-4.5" />
                            Cerrar Sesión
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button
                            variant="outline"
                            className="w-full justify-center rounded-xl border-primary/20 hover:bg-primary/5 text-sm font-bold"
                          >
                            Iniciar Sesión
                          </Button>
                        </Link>
                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full justify-center rounded-xl bg-primary text-sm font-bold shadow-md shadow-primary/10">
                            Registrarse
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
