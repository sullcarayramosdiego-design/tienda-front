'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users,
  Box,
  ShoppingCart, 
  Wallet,
  LogOut,
  User,
  Settings,
  ChevronsUpDown,
  TrendingUp,
  Sun,
  Moon,
  Sparkles,
  Award,
  Gift
} from 'lucide-react';
import { useTheme } from '@/providers';

import {
  Sidebar,
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
import { useAuth } from '@/hooks/useAuth';
import type { User as UserType } from '@/types/api';
import { NotificationBell } from './NotificationBell';

const adminNavigationGroups = [
  {
    label: '📊 ANALÍTICA Y RENDIMIENTO',
    links: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Métricas y Reportes', icon: TrendingUp },
    ],
  },
  {
    label: '📦 GESTIÓN OPERATIVA',
    links: [
      { href: '/admin/orders', label: 'Pedidos y Despachos', icon: ShoppingCart },
      { href: '/admin/inventory', label: 'Inventario 3D', icon: Box },
    ],
  },
  {
    label: '📈 MARKETING & FIDELIZACIÓN',
    links: [
      { href: '/admin/subscriptions', label: 'Suscripciones VIP', icon: Sparkles },
      { href: '/admin/loyalty', label: 'Club de Puntos', icon: Award },
      { href: '/admin/referrals', label: 'Programa de Referidos', icon: Gift },
    ],
  },
  {
    label: '⚙️ ADMINISTRACIÓN',
    links: [
      { href: '/admin/users', label: 'Cuentas de Usuario', icon: Users },
      { href: '/admin/finance', label: 'Finanzas', icon: Wallet },
    ],
  },
];

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
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align={isMobile ? 'end' : 'start'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center justify-between gap-2 px-1 py-1.5 text-left text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                    <span className="truncate font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
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
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/account">
                <User className="size-4" />
                Mi Cuenta
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings className="size-4" />
                Configuración
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="size-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2">
        <div className="flex items-center justify-between gap-2">
          <SidebarMenu className="flex-1 min-w-0">
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                tooltip="Panel Admin"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Link href="/admin">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Box className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Panel Admin</span>
                    <span className="truncate text-xs">E-Commerce 3D</span>
                  </div>
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

      <SidebarContent className="gap-2">
        {adminNavigationGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase px-2 h-6">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    pathname === link.href ||
                    (link.href !== '/admin' && pathname.startsWith(link.href));

                  return (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={link.label}>
                        <Link href={link.href}>
                          <Icon />
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

      <SidebarFooter>
        {user && <NavUser user={user} onLogout={logout} />}
      </SidebarFooter>
    </Sidebar>
  );
}
