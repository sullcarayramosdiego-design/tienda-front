'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users as UsersIcon, 
  Package, 
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Receipt,
  LayoutDashboard,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import reportsService from '@/services/reports.service';
import productsService from '@/services/products.service';
import inventoryService from '@/services/inventory.service';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    products: 0,
    lowStockAlerts: 0,
  });
  const { toast } = useToast();

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      // Cargar reportes financieros, analíticas de usuarios, catálogo y alertas críticas en paralelo
      const [financeData, userData, productsData, alertsData] = await Promise.all([
        reportsService.getFinanceSummary(),
        reportsService.getAnalyticsUsers(),
        productsService.list({ limit: 1 }),
        inventoryService.getLowStockAlerts(10),
      ]);

      // Extraer totales de productos de forma segura
      const totalProducts = (productsData as any).meta?.total 
        || (productsData as any).total 
        || (Array.isArray(productsData) ? productsData.length : 0);

      setStats({
        revenue: financeData?.totalRevenue || 0,
        orders: financeData?.orderCount || 0,
        users: userData?.totalUsers || 0,
        products: totalProducts,
        lowStockAlerts: alertsData?.length || 0,
      });
    } catch (error: any) {
      console.error('Error loading dashboard stats:', error);
      toast({
        type: 'error',
        title: 'Error al sincronizar dashboard',
        description: error.response?.data?.message || 'Error de conexión con el backend.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Formateador de moneda S/.
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value);
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6 w-full p-4">
        {/* Banner Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 pb-6">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              Panel de Control Principal
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Vista general consolidada del rendimiento de la tienda, catálogo e inventario.
            </p>
          </div>
          <Button 
            onClick={loadStats} 
            variant="outline" 
            className="self-start md:self-auto gap-2 font-bold text-xs h-10 px-4 rounded-xl cursor-pointer"
          >
            Refrescar Datos
          </Button>
        </div>

        {/* Notificaciones y Alertas Críticas */}
        {stats.lowStockAlerts > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl p-4 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div className="text-xs font-semibold">
                Alerta de Inventario: Hay <span className="font-extrabold">{stats.lowStockAlerts} productos</span> con stock crítico (bajo 10 unidades).
              </div>
            </div>
            <Link href="/admin/inventory">
              <Button size="sm" variant="outline" className="border-amber-500/20 text-amber-500 hover:bg-amber-500/10 h-8 px-3 rounded-lg font-bold text-[10px] cursor-pointer">
                Gestionar Stock
              </Button>
            </Link>
          </div>
        )}

        {/* Cuadrícula de Métricas Clave */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <Card className="bg-card/70 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
              <TrendingUp className="h-24 w-24 text-emerald-500 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                Ingresos Totales
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-black text-foreground">
                  {formatCurrency(stats.revenue)}
                </div>
              )}
              <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
                Facturación acumulada real
              </p>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card className="bg-card/70 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
              <ShoppingBag className="h-24 w-24 text-primary group-hover:scale-110 transition-transform duration-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                Pedidos Totales
                <ShoppingBag className="h-3.5 w-3.5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-black text-foreground">
                  {stats.orders}
                </div>
              )}
              <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
                Órdenes procesadas en tienda
              </p>
            </CardContent>
          </Card>

          {/* Users */}
          <Card className="bg-card/70 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
              <UsersIcon className="h-24 w-24 text-indigo-500 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                Usuarios Clientes
                <UsersIcon className="h-3.5 w-3.5 text-indigo-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-black text-foreground">
                  {stats.users}
                </div>
              )}
              <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
                Cuentas activas en base
              </p>
            </CardContent>
          </Card>

          {/* Products */}
          <Card className="bg-card/70 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
              <Package className="h-24 w-24 text-amber-500 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                Productos Catálogo
                <Package className="h-3.5 w-3.5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-black text-foreground">
                  {stats.products}
                </div>
              )}
              <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
                Artículos listados a la venta
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secciones de Gestión Rápida */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Panel de Accesos Directos */}
          <Card className="bg-card/40 border-primary/5 p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Gestión Operativa</h3>
              <p className="text-[10px] text-muted-foreground font-semibold">Accesos directos a los flujos principales de administración.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Link href="/admin/orders" className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-primary/5 hover:bg-muted/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Pedidos y Despacho</div>
                    <div className="text-[9px] text-muted-foreground">Kanban drag-and-drop en tiempo real.</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link href="/admin/inventory" className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-primary/5 hover:bg-muted/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Control de Inventario</div>
                    <div className="text-[9px] text-muted-foreground">Alertas críticas, ingresos y egresos.</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link href="/admin/finance" className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-primary/5 hover:bg-muted/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Libro Contable y Finanzas</div>
                    <div className="text-[9px] text-muted-foreground">Historial, ticket promedio e informes CSV.</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </Card>

          {/* Panel de Estadísticas Generales */}
          <Card className="bg-card/40 border-primary/5 p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Analíticas & Seguridad</h3>
              <p className="text-[10px] text-muted-foreground font-semibold">Control administrativo de accesos y visualización de datos.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Link href="/admin/analytics/users" className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-primary/5 hover:bg-muted/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <UsersIcon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Métricas y Cuentas</div>
                    <div className="text-[9px] text-muted-foreground">Conversión de ventas y perfiles administrativos.</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link href="/admin/products" className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-primary/5 hover:bg-muted/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Catálogo & Activos 3D</div>
                    <div className="text-[9px] text-muted-foreground">Gestión de stock, cargas de modelos GLB y visor 3D.</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
