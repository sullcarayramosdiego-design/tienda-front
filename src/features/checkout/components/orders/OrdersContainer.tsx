'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useOrders } from '@/features/checkout/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCw, ShoppingBag } from 'lucide-react';
import { OrderCard, SkeletonOrderCard } from './OrderCard';

export function OrdersContainer() {
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
          <Button variant="ghost" size="sm" onClick={fetchMyOrders} className="text-xs gap-1.5 cursor-pointer">
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
            <Button variant="outline" size="sm" onClick={fetchMyOrders} className="ml-auto text-xs cursor-pointer">
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
          <Button asChild className="mt-6 gap-2 cursor-pointer">
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
