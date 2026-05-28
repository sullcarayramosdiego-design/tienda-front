'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Info, 
  ShoppingBag, 
  CreditCard, 
  Award, 
  Settings, 
  Tag 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { notificationsService, Notification } from '@/services/notifications.service';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface NotificationBellProps {
  variant?: 'ghost' | 'sidebar';
}

export function NotificationBell({ variant = 'ghost' }: NotificationBellProps) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cargar notificaciones
  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationsService.getMyNotifications();
      // Ordenar por fecha (más recientes primero)
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sorted);
      setUnreadCount(sorted.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  }, [isAuthenticated]);

  // Polling cada 15 segundos
  useEffect(() => {
    if (!isAuthenticated) return;

    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, [isAuthenticated, loadNotifications]);

  // Marcar una como leída
  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se cierre el dropdown
    try {
      await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener ícono por tipo
  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ORDER_UPDATE':
        return <ShoppingBag className="h-4 w-4 text-blue-500" />;
      case 'PAYMENT':
        return <CreditCard className="h-4 w-4 text-emerald-500" />;
      case 'LOYALTY':
        return <Award className="h-4 w-4 text-amber-500" />;
      case 'SYSTEM':
        return <Settings className="h-4 w-4 text-slate-500" />;
      case 'PROMO':
        return <Tag className="h-4 w-4 text-rose-500" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  // Calcular tiempo transcurrido
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return `Hace ${diffDays} d`;
  };

  if (!isAuthenticated) return null;

  const isSidebar = variant === 'sidebar';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={isSidebar ? 'default' : 'ghost'}
          size="icon" 
          className={cn(
            "relative h-10 w-10 rounded-xl cursor-pointer transition-all duration-300 active:scale-95 shrink-0",
            isSidebar 
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25 border-none"
              : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
          )}
        >
          <Bell className={cn("h-5 w-5 transition-transform duration-300 hover:rotate-12", isSidebar ? "text-white" : "text-muted-foreground hover:text-foreground")} />
          {unreadCount > 0 && (
            <span className={cn(
              "absolute flex items-center justify-center rounded-full font-extrabold animate-pulse shadow-md border-2",
              isSidebar
                ? "-top-1 -right-1 h-5 w-5 bg-destructive text-[9px] text-destructive-foreground border-sidebar"
                : "top-1.5 right-1.5 h-4 w-4 bg-destructive text-[9px] text-destructive-foreground border-background"
            )}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align={isSidebar ? "start" : "end"} 
        side={isSidebar ? "right" : "bottom"}
        sideOffset={isSidebar ? 12 : 8}
        className="w-80 sm:w-96 rounded-xl p-1.5 border-primary/5 shadow-xl bg-card/95 backdrop-blur-xl z-[60]"
      >
        <DropdownMenuLabel className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">Notificaciones</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="h-5 text-[10px] font-bold bg-primary/10 text-primary border-none">
                {unreadCount} nuevas
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              disabled={loading}
              onClick={handleMarkAllAsRead}
              className="h-8 px-2 text-xs font-bold text-primary hover:text-primary/85 hover:bg-primary/5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Marcar todo
            </Button>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-primary/5" />

        <ScrollArea className="h-72">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center mb-2">
                <Bell className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <span className="text-xs font-bold text-muted-foreground">Sin notificaciones</span>
              <span className="text-[10px] text-muted-foreground/75 mt-0.5">Te avisaremos cuando ocurra algo importante.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {notifications.slice(0, 8).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-2.5 cursor-pointer focus:bg-muted/70 transition-colors relative group",
                    !notification.isRead && "bg-primary/5 border-l-2 border-primary rounded-l-none"
                  )}
                >
                  <div className="h-8 w-8 rounded-lg bg-background border flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={cn(
                        "text-xs text-foreground truncate block",
                        !notification.isRead ? "font-bold" : "font-semibold"
                      )}>
                        {notification.title}
                      </span>
                      <span className="text-[9px] text-muted-foreground shrink-0 font-medium">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                      {notification.message}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 h-6 w-6 rounded-md hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                      title="Marcar como leída"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
