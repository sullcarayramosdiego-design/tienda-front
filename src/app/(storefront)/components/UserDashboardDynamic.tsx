'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth';
import { useProducts } from '@/features/inventory';
import { ProductCard } from '@/features/catalog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Award, 
  Heart, 
  Truck,
  RotateCcw,
  Clock,
  ExternalLink,
  Zap,
  XCircle
} from 'lucide-react';
import { useOrders } from '@/features/checkout';
import { useLoyalty, useWishlist } from '@/features/engagement';

export function UserDashboardDynamic() {
  const { user, isAuthenticated } = useAuth();
  const { account, fetchAccount } = useLoyalty();
  const { items: wishlistItems } = useWishlist();
  const { orders, fetchMyOrders } = useOrders();
  
  // Fetch products for recommendations (unfiltered, page 1)
  const { products, loading } = useProducts({ page: 1, limit: 3 });

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchAccount();
      fetchMyOrders();
    }
  }, [isAuthenticated, fetchAccount, fetchMyOrders]);

  // Slice to show premium recommendations
  const featuredProducts = React.useMemo(() => {
    return Array.isArray(products) ? products.slice(0, 3) : [];
  }, [products]);

  const loyaltyPoints = account?.points ?? 0;

  const activeOrdersCount = React.useMemo(() => {
    if (!orders) return 0;
    return orders.filter(
      (o) => o.status !== 'CANCELLED' && o.status !== 'DELIVERED' && o.status !== 'REFUNDED'
    ).length;
  }, [orders]);

  const wishlistCount = wishlistItems?.length ?? 0;

  const recentOrders = React.useMemo(() => {
    return Array.isArray(orders) ? orders.slice(0, 3) : [];
  }, [orders]);

  if (!isAuthenticated || !user) {
    return null; // Don't render anything if guest
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Welcome Header Hero Banner */}
      <section className="relative overflow-hidden p-6 sm:p-8 md:p-10 border border-primary/10 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent rounded-3xl backdrop-blur-sm">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl opacity-60" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <Badge className="gap-2 text-xs bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-secondary" />
              <span>Panel de Cliente</span>
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight">
              ¡Hola de nuevo,{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                {user.firstName}
              </span>!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              Esta es tu zona de control interactiva. Consulta tu historial, haz seguimiento a tus envíos o explora el catálogo completo en tres dimensiones.
            </p>
          </div>

          <div className="flex gap-3">
            <Button asChild size="lg" className="rounded-2xl bg-primary hover:bg-primary/95 shadow-md shadow-primary/15 font-bold cursor-pointer h-12 px-6 active:scale-98">
              <Link href="/catalog" className="flex items-center gap-2">
                <span>Catálogo Completo</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Client KPI Stats Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card: Puntos Club 3D */}
        <Card className="relative overflow-hidden border border-primary/10 bg-card/60 backdrop-blur-md shadow-md">
          <CardHeader className="pb-2">
            <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Lealtad</span>
            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 mt-1">
              <Award className="h-4.5 w-4.5 text-primary" />
              Mis Puntos Club 3D
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
              {loyaltyPoints.toLocaleString('es-PE')} <span className="text-sm font-bold text-muted-foreground font-sans">Pts</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Canjeables por descuentos en tus compras 3D.
            </p>
          </CardContent>
        </Card>

        {/* Card: Pedidos Activos */}
        <Card className="relative overflow-hidden border border-primary/10 bg-card/60 backdrop-blur-md shadow-md">
          <CardHeader className="pb-2">
            <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Envío exprés</span>
            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 mt-1">
              <ShoppingBag className="h-4.5 w-4.5 text-primary" />
              Mis Pedidos Activos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
              {activeOrdersCount} <span className="text-sm font-bold text-muted-foreground font-sans">En Camino</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Haciendo seguimiento en tiempo real.
            </p>
          </CardContent>
        </Card>

        {/* Card: Favoritos */}
        <Card className="relative overflow-hidden border border-primary/10 bg-card/60 backdrop-blur-md shadow-md">
          <CardHeader className="pb-2">
            <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Favoritos</span>
            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 mt-1">
              <Heart className="h-4.5 w-4.5 text-primary" />
              Guardados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
              {wishlistCount} <span className="text-sm font-bold text-muted-foreground font-sans">{wishlistCount === 1 ? 'Favorito' : 'Favoritos'}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Sincronizados en tu lista de deseos.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Dashboard Sections Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Real Recent Orders Widget */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4.5 w-4.5 text-primary" />
            <h3 className="font-heading font-bold text-lg text-foreground">Pedidos Recientes</h3>
          </div>
          
          {recentOrders.length === 0 ? (
            <Card className="border-primary/10 bg-card/40 backdrop-blur-md shadow-md">
              <CardContent className="p-6 text-center text-xs text-muted-foreground leading-relaxed">
                Aún no has realizado pedidos. ¡Explora el catálogo y adquiere tu primer modelo 3D interactivo!
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary/10 bg-card/40 backdrop-blur-md shadow-md">
              <CardContent className="p-4 divide-y divide-primary/5">
                {recentOrders.map((order) => {
                  const shortId = order.id.slice(-8).toUpperCase();
                  const firstItem = order.items?.[0]?.product?.name || 'Modelo 3D';
                  const otherItemsCount = (order.items?.length || 1) - 1;
                  const displayProducts = otherItemsCount > 0 
                    ? `${firstItem} y ${otherItemsCount} más` 
                    : firstItem;
                  
                  const statusMap: Record<string, { label: string; color: string; icon: any }> = {
                    PENDING: { label: 'Pendiente', color: 'text-amber-500', icon: Clock },
                    CONFIRMED: { label: 'Confirmado', color: 'text-blue-500', icon: Clock },
                    PROCESSING: { label: 'Procesando', color: 'text-violet-500', icon: Clock },
                    SHIPPED: { label: 'En camino', color: 'text-cyan-500', icon: Truck },
                    DELIVERED: { label: 'Entregado', color: 'text-emerald-500', icon: Truck },
                    CANCELLED: { label: 'Cancelado', color: 'text-red-500', icon: XCircle },
                    REFUNDED: { label: 'Reembolsado', color: 'text-slate-500', icon: RotateCcw }
                  };
                  
                  const statusCfg = statusMap[order.status] || { label: order.status, color: 'text-primary', icon: Clock };
                  const StatusIcon = statusCfg.icon;

                  return (
                    <div key={order.id} className="py-3 first:pt-0 last:pb-0">
                      <Link href={`/orders/${order.id}`} className="group hover:opacity-90 transition-opacity block">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black font-mono text-muted-foreground block uppercase">
                            Cod: #{shortId}
                          </span>
                          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors block truncate">
                            {displayProducts}
                          </span>
                          <span className={`flex items-center gap-1.5 text-[10px] ${statusCfg.color} font-semibold`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusCfg.label}
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel: Curated Recommendations Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-primary" />
              <h3 className="font-heading font-bold text-lg text-foreground">Recomendaciones para Ti</h3>
            </div>
            <Link href="/catalog" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Ver Catálogo completo
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-primary/5 bg-card/25 rounded-2xl p-4 space-y-3">
                  <Skeleton className="aspect-square w-full rounded-xl bg-primary/5" />
                  <Skeleton className="h-4 w-1/3 bg-primary/5" />
                  <Skeleton className="h-5 w-3/4 bg-primary/5" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <Card className="border-primary/5 bg-card/20 py-10 text-center">
              <CardContent className="text-xs text-muted-foreground">
                Visita el catálogo para explorar tus primeras piezas 3D.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {featuredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  name={prod.name}
                  price={prod.price}
                  image={`/images/products/${prod.sku}.jpg`}
                  sku={prod.sku}
                  has3D={prod.assets && prod.assets.length > 0}
                  slug={prod.slug}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
