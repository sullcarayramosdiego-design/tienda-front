'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useOrders } from '@/features/checkout';
import type { Order, OrderStatus } from '@/features/checkout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: any; step: number }
> = {
  PENDING:    { label: 'Pendiente',    color: 'bg-amber-500/15 text-amber-600 border-amber-300/30',     icon: Clock,          step: 1 },
  CONFIRMED:  { label: 'Confirmada',   color: 'bg-blue-500/15 text-blue-600 border-blue-300/30',        icon: CheckCircle2,   step: 2 },
  PROCESSING: { label: 'Procesando',   color: 'bg-violet-500/15 text-violet-600 border-violet-300/30',  icon: RefreshCw,      step: 3 },
  SHIPPED:    { label: 'Enviada',      color: 'bg-cyan-500/15 text-cyan-600 border-cyan-300/30',        icon: Truck,          step: 4 },
  DELIVERED:  { label: 'Entregada',    color: 'bg-emerald-500/15 text-emerald-600 border-emerald-300/30', icon: Package,      step: 5 },
  CANCELLED:  { label: 'Cancelada',    color: 'bg-red-500/15 text-red-600 border-red-300/30',           icon: XCircle,        step: 0 },
  REFUNDED:   { label: 'Reembolsada',  color: 'bg-slate-500/15 text-slate-500 border-slate-300/30',     icon: RotateCcw,      step: 0 },
};

const PROGRESS_STEPS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <Badge
      variant="outline"
      className={cn('flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border', cfg.color)}
    >
      <Icon className="h-3 w-3" />
      {cfg.label}
    </Badge>
  );
}

function OrderProgressBar({ status }: { status: OrderStatus }) {
  const currentStep = STATUS_CONFIG[status].step;
  if (currentStep === 0) return null; // CANCELLED / REFUNDED no tienen barra lineal

  return (
    <div className="flex items-center gap-0 mt-3">
      {PROGRESS_STEPS.map((s, i) => {
        const step = i + 1;
        const done = step < currentStep;
        const active = step === currentStep;
        const Icon = STATUS_CONFIG[s].icon;
        return (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div
              className={cn(
                'flex items-center justify-center rounded-full w-6 h-6 shrink-0 text-[10px] transition-all duration-300',
                done   && 'bg-primary text-primary-foreground',
                active && 'bg-primary/20 border-2 border-primary text-primary',
                !done && !active && 'bg-muted text-muted-foreground border border-border',
              )}
            >
              <Icon className="h-3 w-3" />
            </div>
            {i < PROGRESS_STEPS.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-1 rounded-full transition-all duration-500',
                  done ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SkeletonOrderCard() {
  return (
    <Card className="border-border/50 bg-card/60 animate-pulse">
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-4 w-36 bg-muted rounded" />
          </div>
          <div className="h-6 w-20 bg-muted rounded-full" />
        </div>
        <div className="h-px bg-border" />
        <div className="space-y-2">
          <div className="h-3 w-48 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
        <div className="h-5 bg-muted/50 rounded-full" />
      </CardContent>
    </Card>
  );
}

function OrderCard({ order, onCancel }: { order: Order; onCancel: (id: string) => Promise<any> }) {
  const [cancelling, setCancelling] = useState(false);
  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';
  const shortId = order.id.slice(-8).toUpperCase();
  const date = new Date(order.createdAt).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const handleCancel = async () => {
    setCancelling(true);
    await onCancel(order.id).finally(() => setCancelling(false));
  };

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 group">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Orden #{shortId}
            </p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <Separator className="my-3" />

        {/* Items */}
        <div className="space-y-1.5">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex justify-between text-xs">
              <span className="text-foreground font-medium truncate max-w-[60%]">
                {item.product.name}
              </span>
              <span className="text-muted-foreground shrink-0">
                ×{item.quantity} · S/. {item.subtotal.toFixed(2)}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-[11px] text-muted-foreground">
              +{order.items.length - 3} producto{order.items.length - 3 > 1 ? 's' : ''} más
            </p>
          )}
        </div>

        {/* Progress bar */}
        <OrderProgressBar status={order.status} />

        <Separator className="my-3" />

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="space-y-0">
            <p className="text-[11px] text-muted-foreground">Total pagado</p>
            <p className="text-base font-black text-foreground">S/. {order.total.toFixed(2)}</p>
          </div>

          <div className="flex items-center gap-2">
            {canCancel && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive text-xs h-8"
                    disabled={cancelling}
                  >
                    {cancelling ? <RefreshCw className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                    <span className="ml-1.5">{cancelling ? 'Cancelando...' : 'Cancelar'}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent showCloseButton={true}>
                  <DialogHeader>
                    <DialogTitle>¿Cancelar orden #{shortId}?</DialogTitle>
                    <DialogDescription>
                      Esta acción es irreversible. El stock será restaurado automáticamente.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Mantener orden</Button>
                    </DialogClose>
                    <Button
                      onClick={handleCancel}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sí, cancelar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-primary hover:text-primary group-hover:bg-primary/5"
              asChild
            >
              <Link href={`/account/orders/${order.id}`}>
                Ver detalle <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { orders, loading, error, fetchMyOrders, cancelOrder } = useOrders();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return (
    <section className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-foreground">Mis Pedidos</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Consulta el estado y detalle de todas tus órdenes
          </p>
        </div>
        {!loading && orders.length > 0 && (
          <Button variant="ghost" size="sm" onClick={fetchMyOrders} className="text-xs gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Actualizar
          </Button>
        )}
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => <SkeletonOrderCard key={n} />)}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-5 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">Error al cargar pedidos</p>
              <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchMyOrders} className="ml-auto text-xs">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative mb-6">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-9 w-9 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary/20 animate-ping" />
          </div>
          <h2 className="text-lg font-black text-foreground">Aún no tienes pedidos</h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
            Explora nuestro catálogo de modelos 3D y realiza tu primera compra.
          </p>
          <Button asChild className="mt-6 gap-2">
            <Link href="/catalog">
              <ShoppingBag className="h-4 w-4" />
              Ir al catálogo
            </Link>
          </Button>
        </div>
      )}

      {/* Order list */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={cancelOrder} />
          ))}
        </div>
      )}
    </section>
  );
}
