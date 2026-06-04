'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Box, 
  ShoppingCart, 
  Heart, 
  User, 
  LogOut, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  ChevronsUpDown,
  Settings,
  Sun,
  Moon,
  Award,
  Gift
} from 'lucide-react';
import { useTheme } from '@/providers';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/features/auth';
import type  { User as UserType } from '@/features/auth';
import { cn } from '@/lib/utils';
import { NotificationBell } from './NotificationBell';
import { ThemeToggle } from './ThemeToggle';


function NavUser({ user, onLogout }: { user: UserType; onLogout: () => void }) {
  const { isMobile } = useSidebar();
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  const { theme, setTheme } = useTheme();

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg border border-primary/10">
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/15 to-secondary/15 text-primary font-bold text-xs uppercase">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-foreground">
                  {user.firstName} {user.lastName}
                </span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl p-1.5 bg-card/95 backdrop-blur-xl border-primary/5 shadow-xl"
            side={isMobile ? 'bottom' : 'right'}
            align={isMobile ? 'end' : 'start'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-left text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/15 to-secondary/15 text-primary font-bold text-xs animate-pulse">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                    <span className="truncate font-bold text-foreground">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                {/* Theme Toggle Button next to Account Name */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="h-8 w-8 rounded-lg border border-primary/10 hover:bg-muted/80 flex items-center justify-center shrink-0 cursor-pointer text-foreground relative focus-visible:outline-none focus:outline-none"
                  title="Alternar Tema"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
                  <span className="sr-only">Alternar Tema</span>
                </button>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-primary/5" />
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link href="/account" className="flex w-full items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                Mi Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-primary/5" />
            <DropdownMenuItem 
              onClick={onLogout}
              className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20 focus:text-destructive gap-2 text-sm"
            >
              <LogOut className="size-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { state } = useSidebar();

  // Dynamic Navigation Groups depending on Authentication
  const navigationGroups = [
    {
      label: 'Explorar',
      links: [
        { href: '/', label: 'Inicio', icon: Home, matchExact: true },
        { href: '/catalog', label: 'Catálogo Cultural', icon: Box, matchExact: false },
      ]
    },
    ...(isAuthenticated ? [
      {
        label: 'Mi Actividad',
        links: [
          { href: '/cart', label: 'Mi Carrito', icon: ShoppingCart, matchExact: false, alsoActiveOn: ['/checkout'] },
          { href: '/wishlist', label: 'Favoritos', icon: Heart, matchExact: false },
          { href: '/orders', label: 'Mis Pedidos', icon: ShoppingBag, matchExact: false },
        ]
      },
      {
        label: 'Fidelización',
        links: [
          { href: '/loyalty', label: 'Club Andean Vibes', icon: Award, matchExact: false },
          { href: '/referrals', label: 'Programa de Referidos', icon: Gift, matchExact: false },
          { href: '/subscription', label: 'Membresía Cultural', icon: Sparkles, matchExact: false },
        ]
      }
    ] : [])
  ];

  return (
    <ShadcnSidebar collapsible="icon" className="border-r border-primary/10">
      
      {/* Brand Header */}
      <SidebarHeader className="p-2.5">
        <div className="flex items-center justify-between gap-2">
          <SidebarMenu className="flex-1 min-w-0">
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                tooltip="Andean Vibes"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Link href="/">
                  <img 
                    src="/images/logo1.png" 
                    alt="Andean Vibes Logo" 
                    className="h-8 w-auto object-contain shrink-0"
                  />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {state !== 'collapsed' && (
            <div className="shrink-0 animate-fade-in">
              <NotificationBell variant="sidebar" />
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-auto my-1 w-[calc(100%-2rem)] group-data-[collapsible=icon]:w-[calc(100%-1rem)]" />

      {/* Main Navigation Content */}
      <SidebarContent>
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="font-black uppercase tracking-wider text-[10px] text-muted-foreground/60">{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const alsoActive = (link as any).alsoActiveOn ?? [];
                  const isActive = link.matchExact
                    ? pathname === link.href
                    : pathname.startsWith(link.href) || alsoActive.some((p: string) => pathname.startsWith(p));

                  return (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive} 
                        tooltip={link.label}
                        className={cn(
                          "cursor-pointer font-semibold rounded-lg",
                          isActive && "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md shadow-primary/10 focus:text-primary-foreground focus:bg-gradient-to-r"
                        )}
                      >
                        <Link href={link.href}>
                          <Icon className={cn(isActive && "text-white")} />
                          <span>{link.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator className="mx-auto my-1 w-[calc(100%-2rem)] group-data-[collapsible=icon]:w-[calc(100%-1rem)]" />

      {/* Sidebar Footer (User details / dropdown menu) */}
      <SidebarFooter className="p-2">
        {isAuthenticated && user ? (
          <NavUser user={user} onLogout={logout} />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem className="space-y-1 p-1">
              <SidebarMenuButton asChild size="sm" tooltip="Iniciar Sesión" className="w-full justify-center border border-primary/10 rounded-lg h-9 font-semibold text-xs cursor-pointer">
                <Link href="/login">Iniciar Sesión</Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild size="sm" tooltip="Registrarse" className="w-full justify-center bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg h-9 font-bold text-xs cursor-pointer">
                <Link href="/register">Registrarse</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
