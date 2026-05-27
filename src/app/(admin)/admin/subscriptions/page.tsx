'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { subscriptionService, Subscription, SubscriptionPlan } from '@/services/subscription.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Sparkles, 
  Users, 
  Settings, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  ShieldAlert,
  ArrowLeftRight,
  TrendingUp,
  Ban
} from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [subsResult, plansResult] = await Promise.all([
        subscriptionService.getSubscribersAdmin(page, 5),
        subscriptionService.getPlans()
      ]);
      setSubscribers(subsResult.subscriptions);
      setTotalPages(subsResult.totalPages);
      setPlans(plansResult);
    } catch (err: any) {
      console.error('Error al cargar datos administrativos de suscripciones:', err);
      toast({
        type: 'error',
        title: 'Error de Sincronización',
        description: err.response?.data?.message || 'Error de conexión con el backend.'
      });
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleForceCancel = async (subId: string) => {
    if (!confirm('¿Estás seguro de que deseas forzar la baja de esta suscripción? Esto eliminará todos los accesos VIP del usuario inmediatamente.')) return;
    
    try {
      setActionLoading(true);
      await subscriptionService.cancelSubscriptionAdmin(subId);
      toast({
        type: 'success',
        title: 'Baja Administrativa Procesada',
        description: 'La membresía ha sido forzada a vencer y el usuario ha sido notificado.'
      });
      loadData();
    } catch (err: any) {
      console.error('Error al forzar baja:', err);
      toast({
        type: 'error',
        title: 'Error al cancelar',
        description: err.response?.data?.message || 'No se pudo forzar la baja de la membresía.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold">Activo</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold">Cancelación en Curso</Badge>;
      case 'EXPIRED':
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-bold">Vencido</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground border-border">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="space-y-6 animate-pulse p-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-40 rounded-2xl lg:col-span-2" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
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
              <Sparkles className="h-8 w-8 text-primary" />
              Gestión de Suscripciones VIP
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Monitoreo y administración general de miembros premium de la tienda.
            </p>
          </div>
        </div>

        {/* Cuadrícula Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Listado de Suscriptores */}
          <Card className="lg:col-span-8 bg-card/40 border-primary/5 shadow-md rounded-3xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-primary/5">
              <CardTitle className="text-sm font-heading font-extrabold flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-primary" />
                Membresías Registradas en Base de Datos
              </CardTitle>
              <CardDescription className="text-xs">
                Lista de todos los usuarios del sistema que han contratado planes premium.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {subscribers.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <ShieldAlert className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                  <p className="text-sm font-bold text-muted-foreground">No hay suscriptores premium</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-primary/5 hover:bg-transparent">
                        <TableHead className="font-bold text-xs uppercase text-muted-foreground">Usuario</TableHead>
                        <TableHead className="font-bold text-xs uppercase text-muted-foreground">Plan Contratado</TableHead>
                        <TableHead className="font-bold text-xs uppercase text-muted-foreground">Estado</TableHead>
                        <TableHead className="font-bold text-xs uppercase text-muted-foreground">Fechas</TableHead>
                        <TableHead className="font-bold text-xs uppercase text-muted-foreground text-center">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.map((sub) => {
                        const user = sub.user;
                        const startDate = new Date(sub.startDate).toLocaleDateString('es-PE');
                        const endDate = sub.endDate ? new Date(sub.endDate).toLocaleDateString('es-PE') : 'Auto-Renovado';

                        return (
                          <TableRow key={sub.id} className="border-primary/5 hover:bg-primary/5/30 transition-colors">
                            <TableCell className="py-3.5">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground">{user?.firstName} {user?.lastName}</span>
                                <span className="text-[10px] text-muted-foreground font-mono">{user?.email}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3.5">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-primary">{sub.plan.name}</span>
                                <span className="text-[10px] text-muted-foreground font-semibold">
                                  S/. {sub.plan.price.toFixed(2)} / {sub.plan.billingCycle.toLowerCase()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3.5">
                              {getStatusBadge(sub.status)}
                            </TableCell>
                            <TableCell className="py-3.5 text-xs text-muted-foreground font-semibold">
                              <div className="flex flex-col">
                                <span>Inicio: {startDate}</span>
                                <span>Vence: {endDate}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3.5 text-center">
                              {sub.status !== 'EXPIRED' && (
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleForceCancel(sub.id)}
                                  disabled={actionLoading}
                                  className="h-8 px-2.5 rounded-lg border-destructive/20 text-destructive hover:bg-destructive/5 font-bold text-[10px] cursor-pointer"
                                >
                                  <Ban className="h-3.5 w-3.5 mr-1" />
                                  Forzar Baja
                                </Button>
                              )}
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

          {/* Planes Vigentes */}
          <Card className="lg:col-span-4 bg-card/40 border-primary/5 shadow-md rounded-3xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-primary/5">
              <CardTitle className="text-sm font-heading font-extrabold flex items-center gap-2">
                <CreditCard className="h-4.5 w-4.5 text-primary" />
                Catálogo de Planes Premium
              </CardTitle>
              <CardDescription className="text-xs">
                Planes contratables actualmente por los usuarios desde la tienda.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {plans.map((plan) => (
                <div key={plan.id} className="p-4 border border-primary/10 bg-primary/5/30 rounded-2xl space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-foreground">{plan.name}</span>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase">
                      {plan.billingCycle}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{plan.description}</p>
                  <p className="text-sm font-black text-primary">S/. {plan.price.toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </ProtectedRoute>
  );
}
