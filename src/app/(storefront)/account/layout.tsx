'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingBag, Award, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const accountLinks = [
  { href: '/account', label: 'Mi Resumen', icon: User },
  { href: '/account/orders', label: 'Mis Pedidos', icon: ShoppingBag },
  { href: '/account/loyalty', label: 'Club Puntos 3D', icon: Award },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 pb-20">
        
        {/* Breadcrumb banner */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 max-w-7xl">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-semibold">
            <Link href="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">Mi Cuenta</span>
          </div>
        </div>

        {/* Unified Dashboard Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            
            {/* ========================================== */}
            {/* PREMIUM CLIENT SIDEBAR                     */}
            {/* ========================================== */}
            <aside className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-24">
              
              {/* Client Profile Card */}
              {user && (
                <Card className="border-primary/10 bg-card/60 backdrop-blur-md shadow-md overflow-hidden">
                  <CardContent className="p-5 flex items-center gap-4">
                    <Avatar className="h-11 w-11 border border-primary/20 shadow-sm shadow-primary/10">
                      <AvatarFallback className="bg-gradient-to-br from-primary via-secondary to-primary text-white font-extrabold text-sm uppercase">
                        {`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5 min-w-0">
                      <span className="text-sm font-black text-foreground truncate">{`${user.firstName} ${user.lastName}`}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Cliente Club 3D
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Sidebar List */}
              <Card className="border-primary/10 bg-card/60 backdrop-blur-md shadow-md overflow-hidden">
                <CardContent className="p-3 space-y-1.5">
                  {accountLinks.map((link) => {
                    const Icon = link.icon;
                    // Active link check (Overview matches exactly, others start with the path)
                    const isActive = link.href === '/account' 
                      ? pathname === '/account' 
                      : pathname.startsWith(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 active:scale-95 group cursor-pointer",
                          isActive
                            ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md shadow-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={cn(
                            "h-4.5 w-4.5 transition-transform duration-300",
                            isActive ? "scale-110 text-white" : "group-hover:scale-110 group-hover:text-primary"
                          )} />
                          <span>{link.label}</span>
                        </div>
                        <ChevronRight className={cn(
                          "h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all",
                          isActive ? "text-white opacity-100" : "text-muted-foreground"
                        )} />
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Extra Sparkles Badge */}
              <div className="flex items-center gap-3 p-4 border border-primary/10 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent rounded-2xl">
                <Sparkles className="h-5 w-5 text-primary animate-pulse shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-black text-primary uppercase tracking-widest block">Beneficio exclusivo</span>
                  <p className="text-[10px] text-muted-foreground leading-snug">Cada compra en 3D te otorga puntos canjeables por modelos físicos.</p>
                </div>
              </div>
            </aside>

            {/* ========================================== */}
            {/* CLIENT VIEWS CONTAINER                     */}
            {/* ========================================== */}
            <main className="lg:col-span-9 w-full min-h-[500px]">
              {children}
            </main>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
