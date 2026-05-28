'use client';

import React, { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { LedgerTransaction } from '@/services/reports.service';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface FinanceLedgerProps {
  ledger: LedgerTransaction[];
  loading: boolean;
  totalCount: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onExport: () => void;
  onRefresh: () => void;
}

export function FinanceLedger({
  ledger,
  loading,
  totalCount,
  page,
  totalPages,
  onPageChange,
  onExport,
  onRefresh
}: FinanceLedgerProps) {
  const [selectedTx, setSelectedTx] = useState<LedgerTransaction | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="shadow-sm border-muted/40 bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Transacciones Recientes
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading} className="h-8">
            <RefreshCw className={cn("h-4 w-4 text-muted-foreground", loading && "animate-spin")} />
          </Button>
          <Button variant="outline" size="sm" onClick={onExport} disabled={loading || ledger.length === 0} className="h-8 text-xs font-medium">
            <Download className="mr-2 h-3.5 w-3.5" />
            Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-muted/40 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/20">
                <TableHead className="w-[100px] text-xs font-medium">Fecha</TableHead>
                <TableHead className="text-xs font-medium">Concepto</TableHead>
                <TableHead className="text-xs font-medium">Categoría</TableHead>
                <TableHead className="text-xs font-medium">Estado</TableHead>
                <TableHead className="text-right text-xs font-medium">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell align="right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : ledger.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-sm text-muted-foreground">
                    No hay transacciones recientes.
                  </TableCell>
                </TableRow>
              ) : (
                ledger.map((tx) => (
                  <TableRow 
                    key={tx.id} 
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setSelectedTx(tx)}
                  >
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(tx.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      Pedido #{tx.orderId.slice(0, 6).toUpperCase()}
                      <div className="text-xs text-muted-foreground font-normal">{tx.user?.name || 'Cliente'}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                      {tx.paymentMethod}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-medium tracking-wide bg-transparent border",
                          tx.status === 'COMPLETED' || tx.status === 'SUCCESS'
                            ? "text-emerald-700 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800/30"
                            : tx.status === 'PENDING'
                            ? "text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800/30"
                            : "text-rose-700 border-rose-200 dark:text-rose-400 dark:border-rose-800/30"
                        )}
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {formatCurrency(tx.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-muted-foreground">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1 || loading}
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className="h-7 text-xs"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages || loading}
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                className="h-7 text-xs"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <Sheet open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detalles de Transacción</SheetTitle>
            <SheetDescription>
              Información completa de la operación seleccionada.
            </SheetDescription>
          </SheetHeader>
          {selectedTx && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">ID Transacción</p>
                  <p className="font-mono text-xs font-medium">{selectedTx.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">ID Pedido</p>
                  <p className="font-mono text-xs font-medium">#{selectedTx.orderId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p className="font-medium">{new Date(selectedTx.createdAt).toLocaleString('es-PE')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Estado</p>
                  <p className="font-medium">{selectedTx.status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Método</p>
                  <p className="font-medium">{selectedTx.paymentMethod}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Monto Total</p>
                  <p className="font-bold text-lg">{formatCurrency(selectedTx.amount)}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-muted/40">
                <h4 className="text-sm font-medium mb-4">Información del Cliente</h4>
                <div className="grid gap-3 text-sm">
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Nombre</span>
                    <span className="col-span-2 font-medium">{selectedTx.user?.name || 'No registrado'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Email</span>
                    <span className="col-span-2 font-medium">{selectedTx.user?.email || 'No registrado'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Card>
  );
}
