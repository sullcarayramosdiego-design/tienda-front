'use client';

import React, { use, useEffect, useState } from 'react';
import { useOrders } from '@/features/checkout/hooks/useOrders';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  MapPin, 
  ShoppingBag, 
  User, 
  FileText,
  XCircle,
  RefreshCw,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderStatusBadge, OrderProgressBar } from '@/features/checkout/components/orders/OrderProgressBar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { currentOrder, loading, error, fetchOrderById, cancelOrder } = useOrders();
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id, fetchOrderById]);

  const handleCancel = async () => {
    if (!currentOrder) return;
    setCancelling(true);
    try {
      await cancelOrder(currentOrder.id);
      fetchOrderById(currentOrder.id);
    } catch (err) {
      console.error('Error al cancelar la orden:', err);
    } finally {
      setCancelling(false);
    }
  };

  if (loading && !currentOrder) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-semibold">Cargando detalles de tu pedido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12">
        <div className="max-w-2xl mx-auto bg-destructive/5 border border-destructive/20 rounded-3xl p-8 text-center space-y-6">
          <div className="mx-auto h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-black text-foreground">Error al cargar el pedido</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a mis pedidos
              </Link>
            </Button>
            <Button onClick={() => fetchOrderById(id)} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentOrder) return null;

  const order = currentOrder;
  const shortId = order.id.slice(-8).toUpperCase();
  const date = new Date(order.createdAt).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';

  // Helper to parse address
  const getAddressString = (address: any) => {
    if (!address) return 'No especificada';
    if (typeof address === 'string') return address;
    const parts = [
      address.street || address.direccion,
      address.city || address.ciudad,
      address.state || address.departamento,
      address.postalCode || address.codigoPostal,
      address.country || address.pais
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No especificada';
  };

  return (
    <div className="w-full py-6 space-y-6">
      {/* Header Panel */}
      <div className="bg-card/40 border border-primary/10 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <Link 
            href="/orders" 
            className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a mis pedidos
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              Pedido #{shortId}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            Realizado el {date}
          </p>
        </div>

        {/* Global actions (e.g. Cancel order) */}
        {canCancel && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive gap-2 cursor-pointer w-full md:w-auto"
                disabled={cancelling}
              >
                {cancelling ? <RefreshCw className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                <span>{cancelling ? 'Cancelando...' : 'Cancelar Pedido'}</span>
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={true}>
              <DialogHeader>
                <DialogTitle>¿Cancelar pedido #{shortId}?</DialogTitle>
                <DialogDescription>
                  Esta acción es irreversible. El stock de los modelos 3D será restaurado automáticamente y el estado cambiará a Cancelado.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Mantener pedido</Button>
                </DialogClose>
                <Button
                  onClick={handleCancel}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                >
                  Sí, cancelar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Progress & Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details (Items) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Progress */}
          {order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (
            <Card className="border-primary/10 bg-card/40 backdrop-blur-md shadow-lg rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-foreground">Estado del Envío</CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <OrderProgressBar status={order.status} />
              </CardContent>
            </Card>
          )}

          {/* Items Purchased */}
          <Card className="border-primary/10 bg-card/40 backdrop-blur-md shadow-lg rounded-3xl">
            <CardHeader className="pb-3 border-b border-primary/5">
              <CardTitle className="text-base font-black text-foreground flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Artículos del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-primary/5 p-0">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex justify-between items-center gap-4 hover:bg-primary/5 transition-colors">
                  <div className="space-y-1">
                    <Link 
                      href={`/catalog/${item.product.slug}`} 
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors hover:underline block"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Precio Unitario: S/. {item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-muted-foreground">Cantidad: ×{item.quantity}</p>
                    <p className="text-sm font-black text-foreground">S/. {item.subtotal.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info (Payment, Shipping, Summary) */}
        <div className="space-y-6">
          
          {/* Summary / Totals */}
          <Card className="border-primary/10 bg-card/40 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden">
            <div className="bg-primary/5 px-6 py-4 border-b border-primary/5">
              <h3 className="font-black text-sm text-foreground flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-primary" />
                Resumen de Compra
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">S/. {order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-emerald-500">Descuento</span>
                    <span className="text-emerald-500">-S/. {order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="text-foreground">
                    {order.shipping === 0 ? 'Gratis' : `S/. ${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Impuestos (IGV 18%)</span>
                  <span className="text-foreground">S/. {order.tax.toFixed(2)}</span>
                </div>
              </div>
              
              <Separator className="bg-primary/5" />
              
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-foreground">Total Pagado</span>
                <span className="text-lg font-black text-primary">S/. {order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery & Address */}
          <Card className="border-primary/10 bg-card/40 backdrop-blur-md shadow-lg rounded-3xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-foreground">Dirección de Envío</h3>
                  <p className="text-[10px] text-muted-foreground">Datos registrados para la entrega</p>
                </div>
              </div>
              <p className="text-xs text-foreground leading-relaxed pl-10.5">
                {getAddressString(order.shippingAddress)}
              </p>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-primary/10 bg-card/40 backdrop-blur-md shadow-lg rounded-3xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CreditCard className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-foreground">Detalle del Pago</h3>
                  <p className="text-[10px] text-muted-foreground">Método y estado de transacción</p>
                </div>
              </div>
              <div className="pl-10.5 space-y-1">
                <p className="text-xs font-semibold text-foreground">
                  Método: <span className="uppercase text-primary font-bold">{order.payment?.paymentMethod || 'No especificado'}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Estado: <span className="font-bold text-foreground">{order.payment?.status === 'PAID' ? 'Completado (Pagado)' : order.payment?.status || 'Pendiente'}</span>
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
