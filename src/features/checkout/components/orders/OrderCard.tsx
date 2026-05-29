'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Order } from '@/features/checkout/types/order';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronRight, RefreshCw, XCircle } from 'lucide-react';
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
import { OrderStatusBadge, OrderProgressBar } from './OrderProgressBar';

export function SkeletonOrderCard() {
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

export function OrderCard({ order, onCancel }: { order: Order; onCancel: (id: string) => Promise<any> }) {
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
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive text-xs h-8 cursor-pointer"
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
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
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
              className="text-xs h-8 text-primary hover:text-primary group-hover:bg-primary/5 cursor-pointer"
              asChild
            >
              <Link href={`/orders/${order.id}`}>
                Ver detalle <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
