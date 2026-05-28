'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  ComposedChart, Scatter,
  PieChart, Pie, Cell,
  Tooltip, Legend
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from '@/components/ui/chart';
import { DollarSign, Filter, ShoppingBag, Users as UsersIcon, CreditCard, Tag } from 'lucide-react';
import { reportsService } from '@/features/admin';
import { productsService } from '@/features/catalog';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'30d' | 'year' | 'all'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [data, setData] = useState<any>({
    finance: null,
    users: null,
    productsAnalytics: null,
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let startDate: string | undefined;
        let endDate: string | undefined;
        
        const now = new Date();
        if (period === '30d') {
          const past = new Date(now);
          past.setDate(now.getDate() - 30);
          startDate = past.toISOString();
          endDate = now.toISOString();
        } else if (period === 'year') {
          const past = new Date(now.getFullYear(), 0, 1);
          startDate = past.toISOString();
          endDate = now.toISOString();
        }

        const [finance, users, productsAnalytics] = await Promise.all([
          reportsService.getFinanceSummary(startDate, endDate),
          reportsService.getAnalyticsUsers(startDate, endDate),
          reportsService.getAnalyticsProducts(startDate, endDate),
        ]);
        setData({ finance, users, productsAnalytics });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [period]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value || 0);
  };

  // --- MAPPING REAL DATA TO CHARTS ---
  const paymentMethodsData = data.finance?.paymentMethods?.map((pm: any) => ({
    name: pm.method,
    ingresos: pm.revenue,
  })) || [];

  const categoriesData = data.productsAnalytics?.categoriesBreakdown?.map((cat: any) => ({
    name: cat.category,
    ventas: cat.revenue,
  })) || [];

  const dailyUsersData = data.users?.dailyRegistrations?.map((d: any) => ({
    date: d.date.substring(5, 10),
    usuarios: d.count,
  })) || [];

  const topProductsData = data.productsAnalytics?.topProducts
    ?.filter((p: any) => selectedCategory ? p.category === selectedCategory : true)
    ?.map((p: any) => ({
      name: p.name.substring(0, 15) + '...',
      unidades: p.unitsSold,
      ingresos: p.revenue,
    })) || [];

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground animate-pulse font-bold flex flex-col items-center justify-center min-h-screen">Cargando analíticas...</div>;
  }

  return (
    <div className="w-full min-h-full p-0 animate-in fade-in duration-500 bg-background flex flex-col md:flex-row-reverse gap-2 lg:gap-4">
      
      {/* SIDEBAR DE FILTROS A LA DERECHA */}
      <div className="w-full md:w-48 lg:w-56 bg-primary/5 rounded-none md:rounded-2xl p-4 flex flex-col gap-4 border-l border-primary/10 md:border md:border-primary/20 shrink-0">
        <div className="flex items-center gap-2 text-primary font-bold border-b border-primary/20 pb-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm">Filtros</span>
        </div>
        
        <div className="flex gap-2">
          <div className="grid grid-cols-1 gap-1 text-[10px] flex-1">
            <button 
              onClick={() => setPeriod('30d')}
              className={`rounded p-1.5 text-center font-bold shadow-sm transition-colors ${period === '30d' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-primary/20'}`}
            >
              Últimos 30 días
            </button>
            <button 
              onClick={() => setPeriod('year')}
              className={`rounded p-1.5 text-center font-bold shadow-sm transition-colors ${period === 'year' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-primary/20'}`}
            >
              Este Año
            </button>
            <button 
              onClick={() => setPeriod('all')}
              className={`rounded p-1.5 text-center font-bold shadow-sm transition-colors ${period === 'all' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-primary/20'}`}
            >
              Histórico
            </button>
          </div>
          <div className="flex items-center shrink-0">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-background/50 rounded px-1.5 py-2 rotate-180" style={{ writingMode: 'vertical-rl' }}>Periodo</div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <div className="grid grid-cols-2 gap-1 text-[10px] flex-1">
            {data.productsAnalytics?.categoriesBreakdown?.slice(0,6).map((c: any) => {
              const isSelected = selectedCategory === c.category;
              return (
                <button 
                  key={c.category} 
                  onClick={() => setSelectedCategory(isSelected ? null : c.category)}
                  className={`rounded p-1 flex items-center justify-center text-center font-medium shadow-sm transition-colors overflow-hidden text-ellipsis whitespace-nowrap ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-primary/20'}`}
                  title={c.category}
                >
                  <span className="truncate w-full block">{c.category}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center shrink-0">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-background/50 rounded px-1.5 py-2 rotate-180" style={{ writingMode: 'vertical-rl' }}>Categorías</div>
          </div>
        </div>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col gap-2 lg:gap-4 min-w-0">
        
        {/* TOP KPIs REALES */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
          <Card className="shadow-none border-border bg-card rounded-xl">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Ingreso Total</p>
                <p className="text-lg lg:text-xl font-black text-primary tracking-tighter">{formatCurrency(data.finance?.totalRevenue)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-primary/30" />
            </CardContent>
          </Card>
          <Card className="shadow-none border-border bg-card rounded-xl">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Pedidos Pagados</p>
                <p className="text-lg lg:text-xl font-black text-foreground tracking-tighter">{data.finance?.orderCount}</p>
              </div>
              <ShoppingBag className="h-6 w-6 text-foreground/30" />
            </CardContent>
          </Card>
          <Card className="shadow-none border-border bg-card rounded-xl">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Ticket Promedio</p>
                <p className="text-lg lg:text-xl font-black text-secondary tracking-tighter">{formatCurrency(data.finance?.averageTicket)}</p>
              </div>
              <CreditCard className="h-6 w-6 text-secondary/30" />
            </CardContent>
          </Card>
          <Card className="shadow-none border-border bg-card rounded-xl">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Usuarios Activos</p>
                <p className="text-lg lg:text-xl font-black text-accent tracking-tighter">{data.users?.activeBuyersCount}</p>
              </div>
              <UsersIcon className="h-6 w-6 text-accent/30" />
            </CardContent>
          </Card>
        </div>

        {/* CONTENIDO PRINCIPAL BENTO GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 lg:gap-4 flex-1">
          
          {/* COLUMNA IZQUIERDA (Categorías y Pagos) */}
          <div className="flex flex-col gap-2 lg:gap-4 xl:col-span-1">
            <Card className="shadow-none border-border rounded-xl flex-1 flex flex-col">
              <CardHeader className="pb-0 p-3">
                <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-primary" /> Ingresos por Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-1 min-h-[140px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={paymentMethodsData} layout="vertical" margin={{ left: -15, right: 20, top: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={85} style={{ fontSize: '9px', fill: 'var(--foreground)', fontWeight: 600 }} />
                    <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.3 }} formatter={(val: any) => formatCurrency(Number(val))} />
                    <Bar dataKey="ingresos" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={12} label={{ position: 'right', fill: 'var(--foreground)', fontSize: 9, fontWeight: 700 }} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-none border-border rounded-xl flex-1 flex flex-col">
              <CardHeader className="pb-0 p-3">
                <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-secondary" /> Ventas por Categoría
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-1 min-h-[140px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={categoriesData} layout="vertical" margin={{ left: -15, right: 20, top: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={85} style={{ fontSize: '9px', fill: 'var(--foreground)', fontWeight: 600 }} />
                    <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.3 }} formatter={(val: any) => formatCurrency(Number(val))} />
                    <Bar dataKey="ventas" fill="var(--secondary)" radius={[0, 4, 4, 0]} barSize={12} label={{ position: 'right', fill: 'var(--foreground)', fontSize: 9, fontWeight: 700 }} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* COLUMNAS DERECHAS (Evolución y Productos) */}
          <div className="flex flex-col gap-2 lg:gap-4 xl:col-span-2">
            
            {/* Top Productos (Bar+Line Composed) */}
            <Card className="shadow-none border-border rounded-xl flex-1 flex flex-col min-h-[200px]">
              <CardHeader className="pb-0 p-3">
                <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="h-3.5 w-3.5 text-accent" /> Rendimiento de Top Productos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-1">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <ComposedChart data={topProductsData} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted-foreground)" strokeOpacity={0.15} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={5} style={{ fontSize: '9px', fill: 'var(--muted-foreground)' }} />
                    <YAxis yAxisId="left" tickLine={false} axisLine={false} tickFormatter={(val) => `S/${val/1000}k`} style={{ fontSize: '9px', fill: 'var(--muted-foreground)' }} />
                    <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} style={{ fontSize: '9px', fill: 'var(--muted-foreground)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar yAxisId="left" dataKey="ingresos" name="Ingresos Generados" barSize={25} fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" name="Unidades Vendidas" dataKey="unidades" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Evolución de Usuarios */}
            <Card className="shadow-none border-border rounded-xl flex-1 flex flex-col min-h-[200px]">
              <CardHeader className="pb-0 p-3">
                <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <UsersIcon className="h-3.5 w-3.5 text-primary" /> Adquisición Diaria de Usuarios
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-1">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={dailyUsersData} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted-foreground)" strokeOpacity={0.15} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={5} style={{ fontSize: '9px', fill: 'var(--muted-foreground)' }} />
                    <YAxis tickLine={false} axisLine={false} style={{ fontSize: '9px', fill: 'var(--muted-foreground)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                    <Area type="monotone" name="Nuevos Usuarios" dataKey="usuarios" stroke="var(--primary)" strokeWidth={2} fill="url(#fillUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
