'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  DollarSign, 
  Eye, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Filter,
  User as UserIcon,
  MapPin,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { ordersService } from '@/features/checkout';
import type { Order, OrderStatus } from '@/features/checkout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const STATUS_LABELS: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pendiente', color: 'text-amber-500 border-amber-500/20' },
  CONFIRMED: { label: 'Confirmado', color: 'text-blue-500 border-blue-500/20' },
  PROCESSING: { label: 'Procesando', color: 'text-indigo-500 border-indigo-500/20' },
  SHIPPED: { label: 'Enviado', color: 'text-purple-500 border-purple-500/20' },
  DELIVERED: { label: 'Entregado', color: 'text-emerald-500 border-emerald-500/20' },
  CANCELLED: { label: 'Cancelado', color: 'text-rose-500 border-rose-500/20' },
  REFUNDED: { label: 'Reembolsado', color: 'text-teal-500 border-teal-500/20' },
};

export function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Detalle de un Pedido en Modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Cargar lista de pedidos
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ordersService.getAllAdmin({
        page,
        limit,
        search: searchQuery || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      });
      setOrders(data.orders);
      setTotalCount(data.total);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      console.error('Error fetching admin orders list:', error);
      toast({
        type: 'error',
        title: 'Error al cargar pedidos',
        description: error.response?.data?.message || 'Error de comunicación con el servidor.',
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, statusFilter, toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Manejar cambio de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  // Manejar cambio de filtro de estado
  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  // Cambiar estado del pedido desde la fila
  const handleRoleChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await ordersService.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast({
        type: 'success',
        title: 'Estado actualizado',
        description: `El estado del pedido ahora es: ${newStatus}.`,
      });
    } catch (error: any) {
      console.error('Error updating order status from list:', error);
      toast({
        type: 'error',
        title: 'Error al cambiar estado',
        description: error.response?.data?.message || 'Transición de estado inválida.',
      });
    }
  };

  // Formateadores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const s = STATUS_LABELS[status] || { label: status, color: 'text-muted-foreground border-border' };
    return <Badge variant="outline" className={cn("font-mono font-medium text-[10px] uppercase border px-2 py-0.5 rounded-sm shrink-0 bg-transparent", s.color)}>{s.label}</Badge>;
  };

  const openDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Controles de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:max-w-2xl">
          {/* Búsqueda */}
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              type="text"
              placeholder="Buscar por ID de pedido o cliente..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 h-9 rounded-sm bg-transparent border-border focus-visible:ring-1 focus-visible:ring-foreground shadow-none transition-all text-xs"
            />
          </div>

          {/* Filtro de Estado */}
          <div className="w-full sm:w-52 shrink-0">
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="h-9 rounded-sm bg-transparent border-border shadow-none text-xs cursor-pointer">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Filter className="h-3.5 w-3.5" />
                  <SelectValue placeholder="Filtrar por Estado" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card rounded-sm border-border">
                <SelectItem className="text-xs cursor-pointer" value="ALL">Todos los estados</SelectItem>
                {Object.entries(STATUS_LABELS).map(([status, { label }]) => (
                  <SelectItem key={status} className="text-xs cursor-pointer" value={status}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
          <Button onClick={fetchOrders} variant="outline" size="sm" className="h-9 px-3 rounded-sm border-border shadow-none text-xs font-semibold gap-1 cursor-pointer">
            <RefreshCw className="h-3.5 w-3.5" />
            Sincronizar
          </Button>
          <Link href="/admin/orders">
            <Button variant="secondary" size="sm" className="h-9 px-3 rounded-sm shadow-none text-xs font-semibold gap-1.5 cursor-pointer">
              <ClipboardList className="h-3.5 w-3.5" />
              Tablero Kanban
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <div className="w-full">
        <div>
          <div className="rounded-sm border border-border overflow-hidden bg-transparent">
            <Table>
              <TableHeader className="bg-transparent border-b border-border">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-xs">Pedido</TableHead>
                  <TableHead className="font-bold text-xs">Cliente</TableHead>
                  <TableHead className="font-bold text-xs">Fecha de Emisión</TableHead>
                  <TableHead className="font-bold text-xs text-center">Cant. Ítems</TableHead>
                  <TableHead className="font-bold text-xs">Total Facturado</TableHead>
                  <TableHead className="font-bold text-xs">Estado</TableHead>
                  <TableHead className="font-bold text-xs">Actualizar Estado</TableHead>
                  <TableHead className="font-bold text-xs text-right">Detalle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-44 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell align="center"><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5.5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                      <TableCell align="right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-xs font-semibold text-muted-foreground">
                      No se encontraron pedidos registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const clientName = (order as any).user 
                      ? `${(order as any).user.firstName} ${(order as any).user.lastName}` 
                      : 'Cliente Anónimo';
                    const clientEmail = (order as any).user?.email || 'N/A';
                    const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

                    return (
                      <TableRow key={order.id} className="hover:bg-muted/10 transition-colors duration-75">
                        {/* ID Pedido */}
                        <TableCell>
                          <span className="font-mono text-[11px] text-foreground border border-border px-1.5 py-0.5 rounded-sm">
                            {order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </TableCell>

                        {/* Cliente */}
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs text-foreground">
                              {clientName}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {clientEmail}
                            </span>
                          </div>
                        </TableCell>

                        {/* Fecha */}
                        <TableCell className="text-[11px] text-muted-foreground font-mono">
                          {formatDate(order.createdAt)}
                        </TableCell>

                        {/* Cant. Items */}
                        <TableCell className="text-[11px] font-mono text-foreground text-center">
                          {totalItems}
                        </TableCell>

                        {/* Total */}
                        <TableCell className="text-[11px] font-mono text-foreground">
                          {formatCurrency(order.total)}
                        </TableCell>

                        {/* Estado actual */}
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>

                        {/* Actualizar Estado Dropdown */}
                        <TableCell>
                          <Select
                            defaultValue={order.status}
                            onValueChange={(val: any) => handleRoleChange(order.id, val)}
                          >
                            <SelectTrigger className="h-7 w-32 rounded-sm bg-transparent border-border text-[10px] uppercase font-mono shadow-none cursor-pointer">
                              <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent className="bg-card rounded-sm border-border">
                              {Object.entries(STATUS_LABELS).map(([status, { label }]) => (
                                <SelectItem key={status} className="text-[10px] uppercase font-mono cursor-pointer" value={status}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* Botón Ver Detalle */}
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDetails(order)}
                            className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground cursor-pointer transition-colors"
                            title="Ver detalles del pedido"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border mt-4">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">
                Página <span className="text-foreground">{page}</span> / <span className="text-foreground">{totalPages}</span> — <span className="text-foreground">{totalCount}</span> Reg.
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages || loading}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DIALOG: DETALLES COMPLETOS DEL PEDIDO */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="rounded-sm bg-card border-border shadow-2xl max-w-2xl overflow-y-auto max-h-[85vh]" showCloseButton={true}>
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="text-[14px] uppercase font-mono text-foreground flex items-center gap-2 tracking-wider">
              <ShoppingBag className="h-4 w-4" />
              PEDIDO #{selectedOrder?.id.slice(0, 8).toUpperCase()}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Visualiza el desglose de productos facturados, datos de envío y facturación.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 pt-4 text-xs font-semibold">
              {/* Bloque 1: Resumen de Pedido y Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-primary/5">
                <div className="space-y-1.5">
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Fecha de Creación</div>
                  <div className="text-foreground">{formatDate(selectedOrder.createdAt)}</div>
                  
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider pt-2">Estado del Pedido</div>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Cliente</div>
                  <div className="text-foreground flex items-center gap-1.5">
                    <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    {(selectedOrder as any).user 
                      ? `${(selectedOrder as any).user.firstName} ${(selectedOrder as any).user.lastName}` 
                      : 'Cliente Anónimo'}
                  </div>
                  <div className="text-muted-foreground font-mono">{(selectedOrder as any).user?.email || 'N/A'}</div>
                </div>
              </div>

              {/* Bloque 2: Productos Facturados */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-primary/5 pb-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  Artículos del Pedido
                </h3>
                
                <div className="rounded-xl border border-primary/5 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 text-[10px] uppercase font-bold text-muted-foreground border-b border-primary/5">
                        <th className="p-3">Producto</th>
                        <th className="p-3 text-center">Cantidad</th>
                        <th className="p-3 text-right">Precio Unitario</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground">{item.product?.name || 'Producto sin nombre'}</span>
                              <span className="text-[9px] font-mono text-muted-foreground">SKU / ID: {item.productId.slice(0, 8).toUpperCase()}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center text-foreground font-bold">{item.quantity}</td>
                          <td className="p-3 text-right text-muted-foreground">{formatCurrency(item.price)}</td>
                          <td className="p-3 text-right text-foreground font-bold">{formatCurrency(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bloque 3: Datos de Envío y Pago */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Dirección */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-primary/5 pb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Dirección de Despacho
                  </h3>
                  <div className="bg-muted/10 p-3.5 rounded-xl border border-primary/5 space-y-1.5 text-muted-foreground">
                    {selectedOrder.shippingAddress ? (
                      <>
                        <div className="text-foreground font-bold">{selectedOrder.shippingAddress.street || 'Dirección no especificada'}</div>
                        <div>{selectedOrder.shippingAddress.city || 'N/A'}, {selectedOrder.shippingAddress.postalCode || 'N/A'}</div>
                        <div>{selectedOrder.shippingAddress.country || 'Perú'}</div>
                      </>
                    ) : (
                      <div className="text-xs italic">No se especificó dirección de envío.</div>
                    )}
                  </div>
                </div>

                {/* Desglose Financiero */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-primary/5 pb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Resumen Financiero
                  </h3>
                  
                  <div className="bg-muted/10 p-3.5 rounded-xl border border-primary/5 space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-foreground">{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío / Despacho</span>
                      <span className="font-semibold text-foreground">{formatCurrency(selectedOrder.shipping)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-500 font-bold">
                        <span>Descuentos aplicados</span>
                        <span>-{formatCurrency(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-primary/5 pt-2 text-foreground font-black text-sm">
                      <span>Total Neto</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>

                    {/* Método de pago */}
                    {selectedOrder.payment && (
                      <div className="border-t border-primary/5 pt-2.5 mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold">
                        <CreditCard className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>Pago: {selectedOrder.payment.paymentMethod} ({selectedOrder.payment.status})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-primary/5 pt-4 mt-6">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-xl text-xs cursor-pointer">Cerrar Detalle</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
