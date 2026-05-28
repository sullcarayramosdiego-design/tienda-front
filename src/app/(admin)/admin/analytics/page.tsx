'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users as UsersIcon, 
  UserCheck, 
  TrendingUp, 
  UserPlus, 
  Calendar, 
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { ProtectedRoute } from '@/features/auth';
import { reportsService, UserAnalytics } from '@/features/admin';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export default function UsersAnalyticsPage() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { toast } = useToast();

  // Cargar analíticas de usuarios
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reportsService.getAnalyticsUsers(
        startDate || undefined,
        endDate || undefined
      );
      setAnalytics(data);
    } catch (error: any) {
      console.error('Error fetching user analytics:', error);
      toast({
        type: 'error',
        title: 'Error al cargar analíticas',
        description: error.response?.data?.message || 'Error de comunicación con el servidor.',
      });
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, toast]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalytics();
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    // Ejecutar fetch con filtros vacíos
    setTimeout(() => {
      fetchAnalytics();
    }, 0);
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6 w-full p-4">
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Métricas y Reportes de Usuarios
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Monitoreo en tiempo real de registros, conversión y actividad de clientes.
            </p>
          </div>
        </div>

        {/* Filtros de Rango de Fecha */}
        <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4 justify-between items-end bg-card/40 p-4 rounded-xl border border-primary/5">
          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            <div className="flex flex-col gap-1 w-full sm:w-44">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fecha Inicio</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-9 h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-1 w-full sm:w-44">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fecha Fin</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-9 h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto pt-5 md:pt-0">
              <Button type="submit" variant="secondary" className="h-10 px-4 rounded-xl font-bold text-xs gap-1.5 cursor-pointer">
                <RefreshCw className="h-3.5 w-3.5" />
                Filtrar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
                className="h-10 px-3 rounded-xl font-semibold text-xs cursor-pointer"
              >
                Limpiar
              </Button>
            </div>
          </div>
        </form>

        {/* Tarjetas de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Usuarios */}
          <Card className="bg-card/70 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
              <UsersIcon className="h-24 w-24 text-primary group-hover:scale-110 transition-transform duration-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                Total Usuarios
                <UsersIcon className="h-3.5 w-3.5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-black text-foreground">
                  {analytics?.totalUsers || 0}
                </div>
              )}
              <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
                Usuarios registrados en base
              </p>
            </CardContent>
          </Card>

          {/* Compradores Activos */}
          <Card className="bg-card/70 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
              <UserCheck className="h-24 w-24 text-emerald-500 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                Compradores Activos
                <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-black text-foreground">
                  {analytics?.activeBuyersCount || 0}
                </div>
              )}
              <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
                Usuarios con al menos una compra
              </p>
            </CardContent>
          </Card>

          {/* Tasa de Conversión */}
          <Card className="bg-card/70 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
              <TrendingUp className="h-24 w-24 text-amber-500 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                Tasa de Conversión
                <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-black text-foreground">
                  {(analytics?.conversionRate || 0).toFixed(1)}%
                </div>
              )}
              <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
                Tasa de usuarios que compran
              </p>
            </CardContent>
          </Card>

          {/* Nuevos Registros */}
          <Card className="bg-card/70 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
              <UserPlus className="h-24 w-24 text-indigo-500 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                Nuevos Registros
                <UserPlus className="h-3.5 w-3.5 text-indigo-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-black text-foreground">
                  {analytics?.periodNewUsers || 0}
                </div>
              )}
              <p className="text-[10px] font-semibold text-indigo-500/80 mt-1">
                En el rango seleccionado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Tendencia */}
        <Card className="bg-card/40 border-primary/5">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-bold text-foreground">Tendencia de Registros Diarios</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              {loading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : !analytics?.dailyRegistrations || analytics.dailyRegistrations.length === 0 ? (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-primary/5 rounded-xl text-xs font-semibold text-muted-foreground">
                  No hay registros diarios en el rango seleccionado.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={analytics.dailyRegistrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#888888" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(30, 41, 59, 0.95)', 
                        borderColor: 'rgba(99, 102, 241, 0.1)', 
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#f8fafc'
                      }}
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      name="Nuevos Usuarios"
                      stroke="var(--color-primary, #6366f1)" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRegistrations)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
