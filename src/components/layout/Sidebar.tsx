'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Box, ShoppingCart, Menu } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navigationLinks = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/catalog', label: 'Catálogo 3D', icon: Box },
  { href: '/cart', label: 'Mi Carrito', icon: ShoppingCart },
];

function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo/Brand */}
      <div className="p-6">
        <h2 className="text-2xl font-heading font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          3D Store
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          E-Commerce del Futuro
        </p>
      </div>

      <Separator />

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== '/' && pathname.startsWith(link.href));

          return (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                'w-full justify-start gap-3',
                isActive && 'bg-muted text-foreground font-medium'
              )}
            >
              <Link href={link.href}>
                <Icon className="size-5" />
                {link.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      <Separator />

      {/* Auth Buttons */}
      <div className="p-4 space-y-2">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/login">Iniciar Sesión</Link>
        </Button>
        <Button className="w-full" asChild>
          <Link href="/register">Registrarse</Link>
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="size-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Menú de navegación</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r bg-muted/10 flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
