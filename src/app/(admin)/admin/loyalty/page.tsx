'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { loyaltyService, LoyaltyAccount, LoyaltyTier } from '@/services/loyalty.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Award, 
  Users, 
  Trophy, 
  Star, 
  Zap, 
  Crown,
  TrendingUp, 
  ShieldAlert, 
  RefreshCw,
  Plus,
  Minus,
  Edit2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TIER_CONFIG: Record<LoyaltyTier, { label: string; icon: any; badge: string }> = {
  BRONZE: { label: 'Bronce', icon: Star, badge: 'bg-amber-500/10 text-amber-700 border-amber-500/20' },
  SILVER: { label: 'Plata', icon: Zap, badge: 'bg-slate-400/10 text-slate-600 border-slate-400/20' },
  GOLD: { label: 'Oro', icon: Trophy, badge: 'bg-yellow-400/10 text-yellow-700 border-yellow-400/20' },
  PLATINUM: { label: 'Platino', icon: Crown, badge: 'bg-violet-500/10 text-violet-700 border-violet-500/20' },
};

export default function AdminLoyaltyPage() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<LoyaltyAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // States para diálogo de ajuste de puntos
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<LoyaltyAccount | null>(null);
  const [adjustPoints, setAdjustPoints] = useState<string>('');
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [adjustType, setAdjustType] = useState<'add' | 'subtract'>('add');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await loyaltyService.getAccountsAdmin(page, 8);
      setAccounts(result.accounts);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      console.error('Error al cargar datos administrativos de lealtad:', err);
      toast({
        type: 'error',
        title: 'Error de Conexión',
        description: err.response?.data?.message || 'Error de conexión con el backend.'
      });
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdjustPoints = async () => {
    if (!selectedAccount) return;
    
    const pts = parseInt(adjustPoints, 10);
    if (isNaN(pts) || pts <= 0) {
      toast({ type: 'error', title: 'Error de Validación', description: 'Por favor ingresa una cantidad de puntos válida (mayor a 0).' });
      return;
    }

    if (!adjustReason.trim()) {
      toast({ type: 'error', title: 'Error de Validación', description: 'Por favor especifica el motivo del ajuste.' });
      return;
    }

    try {
      setActionLoading(true);
      const pointsToApply = adjustType === 'add' ? pts : -pts;
      
      await loyaltyService.adjustPointsAdmin(selectedAccount.userId, pointsToApply, adjustReason);
      
      toast({
        type: 'success',
        title: 'Ajuste de Puntos Aplicado',
        description: `Se han ${adjustType === 'add' ? 'añadido' : 'deducido'} ${pts} puntos exitosamente.`
      });
      
      setIsAdjustOpen(false);
      setAdjustPoints('');
      setAdjustReason('');
      loadData();
    } catch (err: any) {
      console.error('Error al ajustar puntos:', err);
      toast({
        type: 'error',
        title: 'Error al Aplicar Ajuste',
        description: err.response?.data?.message || 'No se pudo aplicar el ajuste de puntos.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getTierBadge = (tier: LoyaltyTier) => {
    const config = TIER_CONFIG[tier];
    if (!config) return <Badge>{tier}</Badge>;
    const Icon = config.icon;

    return (
      <Badge className={cn('gap-1 font-bold select-none', config.badge)}>
        <Icon className="h-3 w-3 shrink-0" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="space-y-6 animate-pulse p-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6 w-full p-4">
        {/* Banner Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 pb-6">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Award className="h-8 w-8 text-primary animate-pulse" />
              Club Puntos & Fidelización
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Monitoreo y auditoría de cuentas de lealtad, tiers de clientes y transacciones de puntos.
            </p>
          </div>
        </div>

        {/* Listado de Cuentas de Fidelidad */}
        <Card className="bg-card/40 border-primary/5 shadow-md rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-primary/5 flex flex-row items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-sm font-heading font-extrabold flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-primary" />
                Cuentas de Clientes Activas
              </CardTitle>
              <CardDescription className="text-xs">
                Audita el total de puntos acumulados, niveles de membresía y permite realizar abonos o débitos.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={loadData} className="text-xs gap-1.5 cursor-pointer">
              <RefreshCw className="h-3.5 w-3.5" />
              Sincronizar
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {accounts.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <ShieldAlert className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                <p className="text-sm font-bold text-muted-foreground">No hay cuentas de lealtad registradas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary/5 hover:bg-transparent">
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">Usuario Cliente</TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">Tier Actual</TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">Puntos Totales</TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">Equivalencia Descuento</TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">Últimos Movimientos</TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((acc: any) => {
                      const user = acc.user;
                      const discountVal = acc.points / 100;
                      
                      return (
                        <TableRow key={acc.id} className="border-primary/5 hover:bg-primary/5/30 transition-colors">
                          <TableCell className="py-3.5">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-foreground">{user?.firstName} {user?.lastName}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">{user?.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            {getTierBadge(acc.tier)}
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className="text-sm font-black font-mono text-primary">{acc.points.toLocaleString('es-PE')} pts</span>
                          </TableCell>
                          <TableCell className="py-3.5 text-xs text-emerald-600 font-extrabold">
                            S/. {discountVal.toFixed(2)}
                          </TableCell>
                          <TableCell className="py-3.5 max-w-xs">
                            <div className="space-y-1">
                              {acc.transactions && acc.transactions.length > 0 ? (
                                acc.transactions.map((tx: any) => (
                                  <div key={tx.id} className="flex justify-between gap-2 text-[9px] border-b border-primary/5 pb-0.5 last:border-0">
                                    <span className="text-muted-foreground truncate max-w-[120px] font-semibold">{tx.reason}</span>
                                    <span className={tx.points > 0 ? 'text-emerald-500 font-bold' : 'text-primary font-bold'}>
                                      {tx.points > 0 ? '+' : ''}{tx.points} pts
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-[9px] text-muted-foreground">Sin transacciones registradas</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 text-center">
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedAccount(acc);
                                setIsAdjustOpen(true);
                              }}
                              className="h-8 px-2.5 rounded-lg border-primary/10 hover:bg-primary/5 font-bold text-[10px] cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5 mr-1" />
                              Ajustar Puntos
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-primary/5 flex items-center justify-between gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="rounded-lg h-8 text-[10px] font-bold cursor-pointer"
                >
                  Anterior
                </Button>
                <span className="text-[10px] font-bold text-muted-foreground">Página {page} de {totalPages}</span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-lg h-8 text-[10px] font-bold cursor-pointer"
                >
                  Siguiente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diálogo Ajuste de Puntos */}
        {selectedAccount && (
          <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
            <DialogContent className="rounded-3xl border-primary/15 max-w-sm max-h-[85vh] overflow-y-auto">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-lg font-heading font-black">Ajustar Puntos Club 3D</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Modifica manualmente el saldo de puntos de <strong className="text-foreground">{selectedAccount.user?.firstName} {selectedAccount.user?.lastName}</strong>.
                  Saldo actual: <strong>{selectedAccount.points} pts</strong>.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                {/* Tipo de Ajuste */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Tipo de Movimiento</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={adjustType === 'add' ? 'default' : 'outline'}
                      onClick={() => setAdjustType('add')}
                      className="rounded-xl h-10 font-bold text-xs gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Abonar Puntos
                    </Button>
                    <Button
                      type="button"
                      variant={adjustType === 'subtract' ? 'default' : 'outline'}
                      onClick={() => setAdjustType('subtract')}
                      className="rounded-xl h-10 font-bold text-xs gap-1.5 cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                      Debitar Puntos
                    </Button>
                  </div>
                </div>

                {/* Cantidad de Puntos */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Cantidad de Puntos</label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Ej. 500"
                    value={adjustPoints}
                    onChange={(e) => setAdjustPoints(e.target.value)}
                    className="rounded-xl h-10 border-primary/10 font-bold"
                  />
                </div>

                {/* Motivo del Ajuste */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Motivo / Razón de Auditoría</label>
                  <Input
                    type="text"
                    placeholder="Ej. Cortesía por incidencia de soporte"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="rounded-xl h-10 border-primary/10 text-xs font-semibold"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2 gap-3 sm:gap-0">
                <Button variant="outline" onClick={() => setIsAdjustOpen(false)} className="rounded-xl h-10 text-xs font-bold cursor-pointer">
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAdjustPoints} 
                  disabled={actionLoading}
                  className="rounded-xl h-10 text-xs font-bold cursor-pointer bg-primary hover:bg-primary/95 text-white"
                >
                  {actionLoading ? 'Procesando...' : 'Aplicar Ajuste'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </ProtectedRoute>
  );
}
