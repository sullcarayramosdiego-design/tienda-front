'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FinanceLedger, MetricCard } from '@/components/admin';
import { RevenueChart } from '@/components/admin/charts/RevenueChart';
import { reportsService, FinanceSummary, LedgerTransaction } from '@/services/reports.service';
import { useToast } from '@/components/ui/toast';

export default function FinancePage() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [ledger, setLedger] = useState<LedgerTransaction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingLedger, setLoadingLedger] = useState(true);
  
  const { toast } = useToast();

  const fetchSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const data = await reportsService.getFinanceSummary();
      setSummary(data);
    } catch (error: any) {
      toast({
        type: 'error',
        title: 'Error',
        description: 'No se pudo cargar el resumen financiero.',
      });
    } finally {
      setLoadingSummary(false);
    }
  }, [toast]);

  const fetchLedger = useCallback(async () => {
    try {
      setLoadingLedger(true);
      const data = await reportsService.getFinanceLedger(undefined, undefined, page, limit);
      setLedger(data.ledger);
      setTotalCount(data.total);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      toast({
        type: 'error',
        title: 'Error',
        description: 'No se pudo cargar el libro contable.',
      });
    } finally {
      setLoadingLedger(false);
    }
  }, [page, limit, toast]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  const handleExport = () => {
    if (ledger.length === 0) return;
    const headers = ['ID', 'Pedido', 'Cliente', 'Monto', 'Metodo', 'Estado', 'Fecha'];
    const rows = ledger.map(t => [
      t.id, t.orderId, t.user?.name || 'Anonimo', t.amount, t.paymentMethod, t.status, new Date(t.createdAt).toISOString()
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `libro_contable_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  const chartData = useMemo(() => {
    if (ledger.length === 0) return [];
    const dailyMap: Record<string, number> = {};
    ledger.forEach((t) => {
      const dateKey = new Date(t.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + t.amount;
    });
    return Object.entries(dailyMap).map(([date, revenue]) => ({ date, revenue })).reverse();
  }, [ledger]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard Financiero</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Ingresos Totales" 
          value={summary ? formatCurrency(summary.totalRevenue) : 'S/ 0.00'} 
          loading={loadingSummary}
          trend={12.5} // Simulado para demostrar el UI
          trendLabel="vs mes ant."
        />
        <MetricCard 
          title="Ticket Promedio" 
          value={summary ? formatCurrency(summary.averageTicket) : 'S/ 0.00'} 
          loading={loadingSummary}
          trend={3.2}
          trendLabel="vs mes ant."
        />
        <MetricCard 
          title="Beneficio Neto" 
          value={summary ? formatCurrency(summary.totalRevenue * 0.75) : 'S/ 0.00'} 
          loading={loadingSummary}
          trend={15.0}
          trendLabel="estimado"
        />
        <MetricCard 
          title="Margen Operativo" 
          value="75%" 
          loading={loadingSummary}
          trend={-1.5}
          trendLabel="vs mes ant."
        />
      </div>

      <RevenueChart data={chartData} loading={loadingLedger} />

      <FinanceLedger 
        ledger={ledger}
        loading={loadingLedger}
        totalCount={totalCount}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onExport={handleExport}
        onRefresh={() => { fetchSummary(); fetchLedger(); }}
      />
    </div>
  );
}
