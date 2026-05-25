'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Clock, 
  ChevronRight, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';
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

  // Filtrar pedidos en cliente según búsqueda
  const filteredOrders = orders.filter((order) => {
    const term = searchQuery.toLowerCase();
    const orderIdMatches = order.id.toLowerCase().includes(term);
    
    // Buscar en cliente/email
    const clientName = order.user 
      ? `${order.user.firstName} ${order.user.lastName}`.toLowerCase()
      : 'cliente anónimo';
    const email = order.user?.email.toLowerCase() || '';

    return orderIdMatches || clientName.includes(term) || email.includes(term);
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
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Buscar por ID de orden, cliente o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
          />
        </div>
        <div className="text-xs text-muted-foreground font-semibold">
          Total de órdenes cargadas: <span className="text-foreground">{filteredOrders.length}</span>
        </div>
      </div>

      {/* Tablero Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
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
              <div className="flex flex-col gap-2 min-h-[450px]">
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
    </div>
  );
}
