'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartDataPoint {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
};

export function RevenueChart({ data, loading }: RevenueChartProps) {
  return (
    <Card className="shadow-sm border-muted/40 bg-transparent">
      <CardHeader className="pb-0 border-b border-transparent">
        <CardTitle className="text-sm font-medium text-muted-foreground">Tendencia de Ingresos</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px] w-full">
          {loading ? (
            <Skeleton className="h-full w-full rounded-md" />
          ) : data.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-xs text-muted-foreground">
              Sin datos disponibles.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250} minWidth={0}>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAccent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#171717" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#171717" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  style={{ fontSize: '11px', fill: '#737373' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  tickFormatter={(value) => `S/ ${value}`}
                  style={{ fontSize: '11px', fill: '#737373' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5',
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                    fontSize: '12px',
                    color: '#171717'
                  }}
                  itemStyle={{ color: '#171717', fontWeight: 500 }}
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Ingreso']}
                  labelStyle={{ color: '#737373', marginBottom: '4px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#171717"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAccent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}