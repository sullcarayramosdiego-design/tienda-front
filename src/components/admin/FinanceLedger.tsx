'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Receipt, 
  Download, 
  Calendar, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { reportsService, FinanceSummary, LedgerTransaction } from '@/services/reports.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export function FinanceLedger() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [ledger, setLedger] = useState<LedgerTransaction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingLedger, setLoadingLedger] = useState(true);
  const { toast } = useToast();

  // Cargar resumen financiero
  const fetchSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const data = await reportsService.getFinanceSummary(
        startDate || undefined,
        endDate || undefined
      );
      setSummary(data);
    } catch (error: any) {
      console.error('Error fetching finance summary:', error);
      toast({
        type: 'error',
        title: 'Error al cargar resumen financiero',
        description: error.response?.data?.message || 'Error de conexión con el servidor.',
      });
    } finally {
      setLoadingSummary(false);
    }
  }, [startDate, endDate, toast]);

  // Cargar libro contable (ledger) paginado
  const fetchLedger = useCallback(async () => {
    try {
      setLoadingLedger(true);
      const data = await reportsService.getFinanceLedger(
        startDate || undefined,
        endDate || undefined,
        page,
        limit
      );
      setLedger(data.ledger);
      setTotalCount(data.total);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      console.error('Error fetching finance ledger:', error);
      toast({
        type: 'error',
        title: 'Error al cargar libro contable',
        description: error.response?.data?.message || 'Error de conexión.',
      });
    } finally {
      setLoadingLedger(false);
    }
  }, [startDate, endDate, page, limit, toast]);

  // Ejecutar peticiones
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  // Resetear paginación cuando cambien filtros de fecha
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSummary();
    fetchLedger();
  };

  // Formateadores
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
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

  // Procesar datos para gráfico de ingresos diarios agregados
  const chartData = useMemo(() => {
    if (ledger.length === 0) return [];
    
    // Agrupar por fecha
    const dailyMap: Record<string, number> = {};
    
    ledger.forEach((t) => {
      const dateKey = new Date(t.createdAt).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
      });
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + t.amount;
    });

    // Convertir a lista y ordenar por fecha cronológica si es posible
    // (Puesto que ledger ya viene ordenado desc por createdAt, lo revertimos para mostrar orden cronológico)
    return Object.entries(dailyMap)
      .map(([date, revenue]) => ({ date, revenue }))
      .reverse();
  }, [ledger]);

  // Exportación a CSV en cliente
  const handleExportCSV = () => {
    if (ledger.length === 0) {
      toast({
        type: 'warning',
        title: 'Sin datos para exportar',
        description: 'No hay transacciones disponibles en el rango seleccionado.',
      });
      return;
    }

    const headers = ['ID Transaccion', 'ID Orden', 'Cliente', 'Email', 'Monto', 'Metodo Pago', 'Estado', 'Fecha'];
    
    const rows = ledger.map((t) => [
      t.id,
      t.orderId,
      t.user?.name || 'Anonimo',
      t.user?.email || 'N/A',
      t.amount.toString(),
      t.paymentMethod,
      t.status,
      new Date(t.createdAt).toISOString()
    ]);

    const csvContent = 
      'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `libro_contable_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      type: 'success',
      title: 'Exportación completada',
      description: 'Se ha descargado el libro contable en formato CSV.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Filtros de Fecha */}
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
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setPage(1);
              }}
              className="h-10 px-3 rounded-xl font-semibold text-xs cursor-pointer"
            >
              Limpiar
            </Button>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleExportCSV}
          className="w-full md:w-auto h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs gap-1.5 cursor-pointer shadow-md shadow-primary/10"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </form>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <Card className="bg-card/70 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
            <DollarSign className="h-24 w-24 text-primary group-hover:scale-110 transition-transform duration-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Ingresos Totales
              <Badge variant="outline" className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 border-emerald-500/20">
                100%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSummary ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl font-black bg-gradient-to-r from-primary via-indigo-500 to-secondary bg-clip-text text-transparent">
                {formatCurrency(summary?.totalRevenue || 0)}
              </div>
            )}
            <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
              Sobre un total de {summary?.orderCount || 0} órdenes concretadas
            </p>
          </CardContent>
        </Card>

        {/* Average Ticket */}
        <Card className="bg-card/70 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
            <TrendingUp className="h-24 w-24 text-indigo-500 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Ticket Promedio
              <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSummary ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-black text-foreground">
                {formatCurrency(summary?.averageTicket || 0)}
              </div>
            )}
            <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
              Valor medio estimado de compra
            </p>
          </CardContent>
        </Card>

        {/* Transactions Card */}
        <Card className="bg-card/70 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
            <Receipt className="h-24 w-24 text-secondary group-hover:scale-110 transition-transform duration-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Métodos de Pago
              <CreditCard className="h-3.5 w-3.5 text-secondary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSummary ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-black text-foreground">
                {summary?.paymentMethods.length || 0}
              </div>
            )}
            <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1 truncate">
              {summary?.paymentMethods.map(m => m.method).join(', ') || 'Sin transacciones'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Analítico de Tendencia */}
      <Card className="bg-card/40 border-primary/5">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-bold text-foreground">Tendencia de Ventas (Rango Seleccionado)</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64 w-full">
            {loadingLedger ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-primary/5 rounded-xl text-xs font-semibold text-muted-foreground">
                Insuficiente información para graficar tendencia financiera.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false} 
                    axisLine={false} 
                    style={{ fontSize: '10px', fill: 'var(--muted-foreground)' }} 
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    style={{ fontSize: '10px', fill: 'var(--muted-foreground)' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      fontSize: '11px' 
                    }} 
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Ventas']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--color-primary, #6366f1)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabla del Libro Contable */}
      <Card className="bg-card/40 border-primary/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-foreground">Libro Contable Principal</CardTitle>
          <span className="text-xs text-muted-foreground font-semibold bg-muted px-2 py-0.5 rounded-full">
            {totalCount} transacciones
          </span>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-primary/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold text-xs">ID Transacción</TableHead>
                  <TableHead className="font-bold text-xs">ID Pedido</TableHead>
                  <TableHead className="font-bold text-xs">Cliente</TableHead>
                  <TableHead className="font-bold text-xs">Email</TableHead>
                  <TableHead className="font-bold text-xs">Método Pago</TableHead>
                  <TableHead className="font-bold text-xs">Estado</TableHead>
                  <TableHead className="font-bold text-xs">Fecha</TableHead>
                  <TableHead className="font-bold text-xs text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingLedger ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4.5 w-14" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell align="right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : ledger.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-xs font-semibold text-muted-foreground">
                      No se encontraron transacciones registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  ledger.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-semibold text-xs">{tx.id.slice(0, 8).toUpperCase()}</TableCell>
                      <TableCell className="text-xs text-primary font-bold">#{tx.orderId.slice(0, 8).toUpperCase()}</TableCell>
                      <TableCell className="font-semibold text-xs">{tx.user?.name || 'Anónimo'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-semibold">{tx.user?.email || 'N/A'}</TableCell>
                      <TableCell className="text-xs font-bold text-muted-foreground uppercase">{tx.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-black border",
                            tx.status === 'COMPLETED' || tx.status === 'SUCCESS'
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : tx.status === 'PENDING'
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          )}
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-semibold">{formatDate(tx.createdAt)}</TableCell>
                      <TableCell className="font-black text-xs text-right text-foreground">
                        {formatCurrency(tx.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs font-bold text-muted-foreground">
                Página <span className="text-foreground">{page}</span> de <span className="text-foreground">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1 || loadingLedger}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages || loadingLedger}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
