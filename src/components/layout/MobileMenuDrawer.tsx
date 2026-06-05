"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Box, Search, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationGroups = [
  {
    title: "EXPLORAR",
    links: [
      { href: "/", label: "Inicio", icon: Home },
      { href: "/catalog", label: "Catálogo 3D", icon: Box },
      { href: "/mi-peru", label: "Mi Perú", icon: Compass },
    ],
  },
];

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 flex flex-col p-6">
        <SheetHeader className="px-0">
          <SheetTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">3D</span>
            </div>
            E-Commerce 3D
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 mt-8 flex-1">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="pl-10 pr-4"
            />
          </div>

          {/* Navigation Groups */}
          <nav className="flex flex-col gap-6">
            {navigationGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-2">
                {/* Group Title */}
                <h3 className="text-xs font-semibold text-muted-foreground tracking-wider px-2">
                  {group.title}
                </h3>

                {/* Group Links */}
                <div className="flex flex-col gap-1">
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <Separator className="my-2" />

          {/* Authentication Section */}
          <div className="mt-auto pb-2">
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={onClose}>
                <Button
                  variant="outline"
                  className="w-full justify-center border-primary/30 hover:bg-primary/5"
                >
                  Iniciar Sesión
                </Button>
              </Link>

              <Link href="/register" onClick={onClose}>
                <Button className="w-full justify-center">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
