'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { referralsService, ReferralRecord } from '@/services/referrals.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Gift, 
  Users, 
  ShieldAlert, 
  RefreshCw,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function AdminReferralsPage() {
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await referralsService.getAllAdmin(page, 10);
      setReferrals(result.data);
      setTotalPages(result.meta.totalPages);
    } catch (err: any) {
      console.error('Error al cargar referidos globales en admin:', err);
      toast({
        type: 'error',
        title: 'Error de Trazabilidad',
        description: err.response?.data?.message || 'Error de conexión con el backend.'
      });
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
              <Gift className="h-8 w-8 text-primary" />
              Auditoría de Referidos
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Registro general de invitaciones, trazabilidad de conversiones de usuarios e incentivos distribuidos.
            </p>
          </div>
        </div>

        {/* Listado de Referidos Generales */}
        <Card className="bg-card/40 border-primary/5 shadow-md rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-primary/5 flex flex-row items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-sm font-heading font-extrabold flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-primary" />
                Historial General de Invitaciones
              </CardTitle>
              <CardDescription className="text-xs">
                Audita la relación entre patrocinadores e invitados y el estado de su conversión tras realizar su primer pago.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={loadData} className="text-xs gap-1.5 cursor-pointer">
              <RefreshCw className="h-3.5 w-3.5" />
              Sincronizar
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {referrals.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <ShieldAlert className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                <p className="text-sm font-bold text-muted-foreground">No hay invitaciones registradas en la plataforma</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary/5 hover:bg-transparent">
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">Patrocinador (Referrer)</TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">Invitado (Referee)</TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">Estado</TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">Puntos Entregados</TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">Fecha de Creación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.map((item) => {
                      const dateStr = new Date(item.createdAt).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                        <TableRow key={item.id} className="border-primary/5 hover:bg-primary/5/30 transition-colors">
                          <TableCell className="py-3.5">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-foreground">
                                {item.referrer?.firstName} {item.referrer?.lastName}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">{item.referrer?.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-foreground">
                                {item.referred?.firstName} {item.referred?.lastName}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">{item.referred?.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={`px-2 py-0.5 inline-flex items-center gap-1 text-[9px] font-black uppercase rounded-md border tracking-wider select-none ${
                              item.status === 'COMPLETED' 
                                ? 'bg-[#00D47C]/10 border-[#00D47C]/15 text-[#00AF66]' 
                                : 'bg-amber-500/10 border-amber-500/15 text-amber-500'
                            }`}>
                              {item.status === 'COMPLETED' ? (
                                <><CheckCircle2 className="h-3 w-3 shrink-0" /> Completado</>
                              ) : (
                                <><Clock className="h-3 w-3 shrink-0" /> Registrado / Pendiente</>
                              )}
                            </span>
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span className={`text-xs font-black font-mono ${item.pointsAwarded > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                              {item.pointsAwarded > 0 ? `+${item.pointsAwarded} pts` : '0 pts'}
                            </span>
                          </TableCell>
                          <TableCell className="py-3.5 text-xs text-muted-foreground font-semibold">
                            {dateStr}
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
      </div>
    </ProtectedRoute>
  );
}
