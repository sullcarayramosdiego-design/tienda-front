'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Clock, 
  ChevronLeft,
  ChevronRight, 
  DollarSign, 
  AlertCircle,
  SlidersHorizontal,
  Calendar,
  CreditCard,
  Hash
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { ordersService } from '@/services/orders.service';
import type { Order, OrderStatus } from '@/types/order';

interface OrderWithUser extends Order {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const COLUMNS: Array<{ status: OrderStatus; label: string; color: string }> = [
  { status: 'PENDING', label: 'Pendiente', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { status: 'CONFIRMED', label: 'Confirmado', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { status: 'PROCESSING', label: 'Procesando', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
  { status: 'SHIPPED', label: 'Enviado', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { status: 'DELIVERED', label: 'Entregado', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { status: 'CANCELLED', label: 'Cancelado', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
];

export function OrderKanban() {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dragOverColumn, setDragOverColumn] = useState<OrderStatus | null>(null);
  const { toast } = useToast();

  // Estados para flechas de navegación horizontal
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Estados para filtros avanzados
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('ALL');
  const [minItems, setMinItems] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateScrollArrows = useCallback(() => {
    const mainEl = document.getElementById('admin-main-content');
    if (!mainEl) return;

    const { scrollLeft, scrollWidth, clientWidth } = mainEl;
    setShowLeftArrow(scrollLeft > 15);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 15);
  }, []);

  useEffect(() => {
    const mainEl = document.getElementById('admin-main-content');
    if (!mainEl) return;

    const timer = setTimeout(updateScrollArrows, 300);

    mainEl.addEventListener('scroll', updateScrollArrows);
    window.addEventListener('resize', updateScrollArrows);

    return () => {
      clearTimeout(timer);
      mainEl.removeEventListener('scroll', updateScrollArrows);
      window.removeEventListener('resize', updateScrollArrows);
    };
  }, [updateScrollArrows, orders]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(updateScrollArrows, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, updateScrollArrows]);

  // Cargar pedidos para el Kanban
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ordersService.getAllAdmin({ limit: 100 });
      setOrders(data.orders);
    } catch (error: any) {
      console.error('Error fetching admin orders:', error);
      toast({
        type: 'error',
        title: 'Error al cargar pedidos',
        description: error.response?.data?.message || 'Hubo un error al sincronizar el servidor.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Manejadores de Drag and Drop nativo
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: OrderStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: OrderStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const orderId = e.dataTransfer.getData('text/plain');
    if (!orderId) return;

    // Buscar orden original
    const originalOrder = orders.find((o) => o.id === orderId);
    if (!originalOrder) return;
    if (originalOrder.status === targetStatus) return;

    // --- APLICAR ACTUALIZACIÓN OPTIMISTA ---
    // Mover inmediatamente en UI
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === orderId ? { ...o, status: targetStatus } : o))
    );

    try {
      // Llamada real al backend
      await ordersService.updateStatus(orderId, targetStatus);
      
      toast({
        type: 'success',
        title: 'Estado actualizado',
        description: `El pedido #${orderId.slice(0, 8)} ahora está en: ${targetStatus}.`,
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      
      // --- REVERTIR ACTUALIZACIÓN OPTIMISTA EN CASO DE FALLO ---
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === orderId ? { ...o, status: originalOrder.status } : o))
      );

      toast({
        type: 'error',
        title: 'No se pudo actualizar',
        description: error.response?.data?.message || 'Error de permisos o transición de estado inválida.',
      });
    }
  };

  // Filtrar pedidos en cliente según búsqueda y filtros avanzados
  const filteredOrders = orders.filter((order) => {
    // 1. Búsqueda por ID, Cliente o Email
    const term = searchQuery.toLowerCase();
    const orderIdMatches = order.id.toLowerCase().includes(term);
    const clientName = order.user 
      ? `${order.user.firstName} ${order.user.lastName}`.toLowerCase()
      : 'cliente anónimo';
    const email = order.user?.email.toLowerCase() || '';
    const searchMatches = !searchQuery || orderIdMatches || clientName.includes(term) || email.includes(term);

    if (!searchMatches) return false;

    // 2. Rango de Precios (Monto Total)
    if (minPrice && order.total < parseFloat(minPrice)) return false;
    if (maxPrice && order.total > parseFloat(maxPrice)) return false;

    // 3. Cantidad de Ítems
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    if (minItems && totalItems < parseInt(minItems)) return false;

    // 4. Método de Pago
    if (paymentMethod !== 'ALL') {
      const method = order.payment?.paymentMethod?.toUpperCase() || '';
      const filterPM = paymentMethod.toUpperCase();
      if (filterPM === 'TARJETA' && !method.includes('CARD') && !method.includes('CULQI') && !method.includes('TARJETA')) return false;
      if (filterPM === 'YAPE' && !method.includes('YAPE')) return false;
      if (filterPM === 'PLIN' && !method.includes('PLIN')) return false;
      if (filterPM === 'EFECTIVO' && !method.includes('CASH') && !method.includes('COD') && !method.includes('CONTRA')) return false;
    }

    // 5. Rango de Fechas
    if (startDate) {
      const orderDate = new Date(order.createdAt);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (orderDate < start) return false;
    }
    if (endDate) {
      const orderDate = new Date(order.createdAt);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (orderDate > end) return false;
    }

    return true;
  });

  // Agrupar órdenes por columna
  const getOrdersByStatus = (status: OrderStatus) => {
    return filteredOrders.filter((o) => o.status === status);
  };

  // Formateador de moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
  };

  // Formateador de fecha simple
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/40 p-4 rounded-xl border border-primary/5">
        <div className="relative w-full sm:max-w-md group flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Buscar por ID de orden, cliente o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all text-xs"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "h-10 px-3.5 rounded-xl text-xs font-bold gap-1.5 flex items-center justify-center border transition-all shrink-0 cursor-pointer",
              showAdvanced 
                ? "bg-secondary text-secondary-foreground border-secondary"
                : "border-primary/5 hover:bg-primary/5 text-muted-foreground"
            )}
            title="Filtros avanzados"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground font-semibold">
            Total de órdenes cargadas: <span className="text-foreground">{filteredOrders.length}</span>
          </div>
          {(showLeftArrow || showRightArrow) && (
            <div className="flex items-center gap-1.5 border-l border-primary/5 pl-4 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const mainEl = document.getElementById('admin-main-content');
                  mainEl?.scrollBy({ left: -320, behavior: 'smooth' });
                }}
                disabled={!showLeftArrow}
                className="h-9 w-9 rounded-xl border border-primary/5 hover:bg-primary/5 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Desplazar a la izquierda"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const mainEl = document.getElementById('admin-main-content');
                  mainEl?.scrollBy({ left: 320, behavior: 'smooth' });
                }}
                disabled={!showRightArrow}
                className="h-9 w-9 rounded-xl border border-primary/5 hover:bg-primary/5 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Desplazar a la derecha"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filtros Avanzados Desplegables */}
      {showAdvanced && (
        <Card className="bg-card/30 border-primary/5 p-5 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
            {/* Rango de Precios */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Rango de Precios (S/.)
              </span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-9 rounded-lg bg-muted/40 border-primary/5 text-xs"
                />
                <span className="text-muted-foreground/60">—</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-9 rounded-lg bg-muted/40 border-primary/5 text-xs"
                />
              </div>
            </div>

            {/* Método de Pago */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-muted-foreground/80" /> Método de Pago
              </span>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="h-9 rounded-lg bg-muted/30 border-primary/5 text-xs cursor-pointer">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem className="text-xs cursor-pointer" value="ALL">Todos los métodos</SelectItem>
                  <SelectItem className="text-xs cursor-pointer" value="TARJETA">Tarjeta de Crédito/Débito</SelectItem>
                  <SelectItem className="text-xs cursor-pointer" value="YAPE">Yape QR</SelectItem>
                  <SelectItem className="text-xs cursor-pointer" value="PLIN">Plin QR</SelectItem>
                  <SelectItem className="text-xs cursor-pointer" value="EFECTIVO">Contra Entrega / Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cantidad Mínima de Ítems */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Hash className="h-3 w-3" /> Cantidad Mínima de Ítems
              </span>
              <Input
                type="number"
                placeholder="Ej. 2 items"
                value={minItems}
                onChange={(e) => setMinItems(e.target.value)}
                className="h-9 rounded-lg bg-muted/40 border-primary/5 text-xs"
              />
            </div>

            {/* Rango de Fechas */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Rango de Fechas
              </span>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 rounded-lg bg-muted/40 border-primary/5 text-xs cursor-pointer"
                />
                <span className="text-muted-foreground/60">—</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 rounded-lg bg-muted/40 border-primary/5 text-xs cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-primary/5 pt-3">
            <button
              type="button"
              onClick={() => {
                setMinPrice('');
                setMaxPrice('');
                setPaymentMethod('ALL');
                setMinItems('');
                setStartDate('');
                setEndDate('');
                setSearchQuery('');
              }}
              className="h-8 px-3 rounded-lg text-xs font-semibold border border-primary/5 hover:bg-primary/5 cursor-pointer transition-colors"
            >
              Restablecer Filtros
            </button>
            <button
              type="button"
              onClick={() => setShowAdvanced(false)}
              className="h-8 px-3 rounded-lg text-xs font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer transition-colors"
            >
              Aplicar y Ocultar
            </button>
          </div>
        </Card>
      )}

      {/* Tablero Kanban */}
      <div className="flex gap-4 min-w-max pb-4">
        {COLUMNS.map(({ status, label, color }) => {
          const columnOrders = getOrdersByStatus(status);
          const isOver = dragOverColumn === status;

          return (
            <div
              key={status}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
              className={cn(
                "flex-1 min-w-[280px] max-w-[320px] rounded-xl p-3 border transition-colors duration-200",
                isOver 
                  ? "bg-primary/5 border-primary/40 border-dashed" 
                  : "bg-muted/10 border-primary/5"
              )}
            >
              {/* Encabezado Columna */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border", color)}>
                    {label}
                  </Badge>
                </div>
                <span className="text-xs font-black text-muted-foreground/80 bg-background border border-primary/5 px-2 py-0.5 rounded-full shadow-sm">
                  {columnOrders.length}
                </span>
              </div>

              {/* Lista de Pedidos en Columna */}
              <div className="flex flex-col gap-2">
                {loading ? (
                  // Skeletons de Carga
                  Array.from({ length: 2 }).map((_, idx) => (
                    <Card key={idx} className="p-3.5 space-y-3">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-4 w-32" />
                      <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </Card>
                  ))
                ) : columnOrders.length === 0 ? (
                  // Columna Vacía
                  <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-primary/5 rounded-xl flex-1 bg-card/10">
                    <ShoppingBag className="h-7 w-7 text-muted-foreground/35 mb-1.5" />
                    <span className="text-[10px] font-bold text-muted-foreground/50">Sin pedidos</span>
                  </div>
                ) : (
                  // Render de Tarjetas de Pedidos
                  columnOrders.map((order) => (
                    <Card
                      key={order.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, order.id)}
                      className={cn(
                        "p-3.5 bg-card/90 border-primary/5 hover:border-primary/20 hover:shadow-md cursor-grab active:cursor-grabbing transition-all select-none hover:-translate-y-0.5 duration-200"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-primary bg-primary/5 px-1.5 py-0.5 rounded">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-xs font-extrabold text-foreground">
                          {formatCurrency(order.total)}
                        </span>
                      </div>

                      {/* Cliente */}
                      <div className="flex items-center gap-1.5 my-2">
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <UserIcon className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground truncate max-w-[180px]">
                          {order.user 
                            ? `${order.user.firstName} ${order.user.lastName}` 
                            : 'Cliente Anónimo'}
                        </span>
                      </div>

                      <div className="border-t border-primary/5 my-2 pt-2 flex items-center justify-between">
                        {/* Fecha */}
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        
                        {/* Items */}
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} ítems
                        </span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicador flotante izquierdo de "Más contenido a la izquierda" */}
      {showLeftArrow && (
        <button
          type="button"
          onClick={() => {
            const mainEl = document.getElementById('admin-main-content');
            mainEl?.scrollBy({ left: -320, behavior: 'smooth' });
          }}
          className="fixed left-[calc(var(--sidebar-width)+24px)] top-[55%] -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-primary/95 text-primary-foreground shadow-lg border border-primary/20 hover:scale-110 active:scale-95 transition-all hidden md:flex items-center justify-center cursor-pointer group animate-bounce"
          style={{ animationDuration: '2.5s' }}
          title="Ver más a la izquierda"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Indicador flotante derecho de "Más contenido a la derecha" */}
      {showRightArrow && (
        <button
          type="button"
          onClick={() => {
            const mainEl = document.getElementById('admin-main-content');
            mainEl?.scrollBy({ left: 320, behavior: 'smooth' });
          }}
          className="fixed right-6 top-[55%] -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-primary/95 text-primary-foreground shadow-lg border border-primary/20 hover:scale-110 active:scale-95 transition-all hidden md:flex items-center justify-center cursor-pointer group animate-bounce"
          style={{ animationDuration: '2.5s' }}
          title="Ver más a la derecha"
        >
          <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
