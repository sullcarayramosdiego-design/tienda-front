'use client';

import React, { useState, useEffect } from 'react';
import { subscriptionService, SubscriptionPlan, Subscription } from '@/services/subscription.service';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  Sparkles, 
  Check, 
  Zap, 
  ShieldCheck, 
  Calendar, 
  AlertCircle, 
  CreditCard, 
  Clock,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function SubscriptionPage() {
  const { user } = useAuth();
  
  // State management
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSub, setCurrentSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch plans and subscription on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErrorMsg(null);
        
        const [availablePlans, userSub] = await Promise.all([
          subscriptionService.getPlans(),
          subscriptionService.getCurrentSubscription()
        ]);
        
        setPlans(availablePlans);
        setCurrentSub(userSub);
      } catch (err) {
        console.error('Error cargando suscripciones:', err);
        setErrorMsg('No se pudieron cargar los datos de suscripción. Por favor reintenta.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle Subscribe
  const handleSubscribe = async (planId: string) => {
    try {
      setActionLoading(true);
      setErrorMsg(null);
      
      const newSub = await subscriptionService.subscribe(planId);
      setCurrentSub(newSub);
      
      // Forzar recarga rápida de la sesión si es necesario, o notificar éxito
    } catch (err: any) {
      console.error('Error al suscribirse:', err);
      setErrorMsg(err.response?.data?.message || 'Error al procesar la suscripción.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Cancel
  const handleCancelSubscription = async () => {
    try {
      setActionLoading(true);
      setErrorMsg(null);
      
      const updatedSub = await subscriptionService.cancelSubscription();
      setCurrentSub(updatedSub);
      setIsCancelDialogOpen(false);
    } catch (err: any) {
      console.error('Error al cancelar suscripción:', err);
      setErrorMsg(err.response?.data?.message || 'Error al cancelar la renovación automática.');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to get Spanish name for BillingCycle
  const getBillingCycleText = (cycle: string) => {
    switch (cycle) {
      case 'YEARLY': return 'Año';
      case 'QUARTERLY': return 'Trimestre';
      case 'MONTHLY':
      default:
        return 'Mes';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Welcome & Context Header */}
      <section className="relative overflow-hidden p-6 sm:p-8 border border-primary/10 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent rounded-3xl backdrop-blur-sm">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl opacity-60" />
        
        <div className="relative z-10 space-y-2.5">
          <Badge className="gap-2 text-xs bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-secondary" />
            <span>Beneficios VIP</span>
          </Badge>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight leading-tight">
            Suscripción{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Premium 3D
            </span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
            Desbloquea Realidad Aumentada móvil avanzada, subidas de modelos GLB ilimitadas, envíos gratis asegurados y acumulación de puntos Club 3D acelerada.
          </p>
        </div>
      </section>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-2xl text-destructive text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ========================================== */}
      {/* 1. VISTA SI EL USUARIO YA TIENE SUSCRIPCIÓN */}
      {/* ========================================== */}
      {currentSub ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tarjeta de estado de suscripción */}
          <Card className="lg:col-span-7 border-primary/10 bg-card/60 backdrop-blur-md shadow-md overflow-hidden relative rounded-3xl">
            {currentSub.status === 'ACTIVE' && (
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            )}
            
            <CardHeader className="border-b border-primary/5 pb-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Suscripción actual</span>
                  <CardTitle className="text-xl font-heading font-bold text-foreground">
                    {currentSub.plan.name}
                  </CardTitle>
                </div>
                <Badge className={`rounded-xl px-3 py-1 font-bold ${
                  currentSub.status === 'ACTIVE' 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {currentSub.status === 'ACTIVE' ? 'Activo' : 'Cancelado / Vence pronto'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              
              {/* Grid de KPIs de la suscripción */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-primary/5 bg-primary/5 rounded-2xl flex flex-col justify-center space-y-1">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5 text-primary" /> Precio
                  </span>
                  <span className="text-xl font-heading font-black text-foreground">
                    S/. {currentSub.plan.price.toFixed(2)}
                    <span className="text-xs font-bold text-muted-foreground font-sans">/{getBillingCycleText(currentSub.plan.billingCycle).toLowerCase()}</span>
                  </span>
                </div>

                <div className="p-4 border border-primary/5 bg-primary/5 rounded-2xl flex flex-col justify-center space-y-1">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> {currentSub.autoRenew ? 'Renovación' : 'Vencimiento'}
                  </span>
                  <span className="text-base font-bold text-foreground">
                    {currentSub.endDate ? new Date(currentSub.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Información sobre renovación */}
              <div className="p-4 border border-primary/15 bg-primary/5 rounded-2xl flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary animate-pulse mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-foreground">
                    {currentSub.autoRenew ? 'Facturación Automática Habilitada' : 'Facturación Automática Desactivada'}
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {currentSub.autoRenew 
                      ? `Tu suscripción se renovará automáticamente el ${currentSub.endDate ? new Date(currentSub.endDate).toLocaleDateString() : ''} cargando a tu método de pago guardado.`
                      : `Has cancelado la suscripción. Tus beneficios premium expirarán el ${currentSub.endDate ? new Date(currentSub.endDate).toLocaleDateString() : ''} y no se realizarán nuevos cargos.`}
                  </p>
                </div>
              </div>

              {/* Acciones */}
              {currentSub.autoRenew && (
                <div className="flex justify-end pt-2">
                  <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive cursor-pointer font-bold transition-all active:scale-98">
                        Cancelar Suscripción
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl border-primary/10 max-w-sm">
                      <DialogHeader className="space-y-2">
                        <DialogTitle className="text-lg font-heading font-black text-foreground">¿Desactivar renovación automática?</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                          Perderás el acceso preferencial a Realidad Aumentada, el soporte VIP 3D, y los envíos gratis automáticos una vez que termine el ciclo facturado actual ({currentSub.endDate ? new Date(currentSub.endDate).toLocaleDateString() : ''}).
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="flex gap-3 sm:gap-0 pt-2">
                        <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} className="rounded-xl border-primary/15 font-bold cursor-pointer hover:bg-accent/60">
                          Mantener Plan
                        </Button>
                        <Button 
                          onClick={handleCancelSubscription} 
                          disabled={actionLoading}
                          className="rounded-xl bg-destructive hover:bg-destructive/95 text-white font-bold cursor-pointer"
                        >
                          {actionLoading ? 'Procesando...' : 'Sí, Cancelar'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tarjeta de resumen de beneficios activos */}
          <Card className="lg:col-span-5 border-primary/10 bg-card/60 backdrop-blur-md shadow-md overflow-hidden rounded-3xl">
            <CardHeader className="border-b border-primary/5 pb-4">
              <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Beneficios de tu plan</span>
              <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 mt-1">
                <ShieldCheck className="h-4.5 w-4.5 text-primary" />
                Mis Privilegios VIP Activos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground">Visualización 3D Prioritaria</span>
                    <p className="text-[10px] text-muted-foreground">Carga instantánea de los visualizadores GLB en catálogo sin retardos.</p>
                  </div>
                </li>

                {currentSub.plan.features.arEnabled && (
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground">Realidad Aumentada (AR) Avanzada</span>
                      <p className="text-[10px] text-muted-foreground">Posibilidad de interactuar y probar modelos a escala real en tu dispositivo móvil.</p>
                    </div>
                  </li>
                )}

                {currentSub.plan.features.premiumDiscounts && (
                  <li className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground">Descuento Directo Premium</span>
                      <p className="text-[10px] text-muted-foreground">10% de descuento directo en tus compras, acumulable con Club Puntos 3D.</p>
                    </div>
                  </li>
                )}

                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground">Envíos VIP y Soporte Técnico</span>
                    <p className="text-[10px] text-muted-foreground">Atención 24/7 y empaquetado exclusivo de alta protección para tus compras físicas.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

        </div>
      ) : (
        // ==========================================
        // 2. VISTA DE SUSCRIPCIÓN COMPRA (GUEST)
        // ==========================================
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-2">
            <h2 className="text-2xl font-heading font-extrabold text-foreground">Elige tu membresía Club Premium 3D</h2>
            <p className="text-xs text-muted-foreground">
              Comienza hoy mismo a disfrutar de una experiencia de compra completamente inmersiva y de la máxima velocidad en tu portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => {
              // Determinar si es el plan recomendado (Plata AR)
              const isRecommended = plan.name.toLowerCase().includes('plata');
              
              return (
                <Card 
                  key={plan.id}
                  className={`border rounded-3xl overflow-hidden relative flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${
                    isRecommended 
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5 ring-1 ring-primary/50' 
                      : 'border-primary/10 bg-card/60'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute top-0 right-0 left-0 bg-primary text-primary-foreground text-center py-1 text-[10px] font-black uppercase tracking-widest">
                      Plan Recomendado
                    </div>
                  )}

                  <div>
                    <CardHeader className={`pb-4 ${isRecommended ? 'pt-8' : 'pt-6'}`}>
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Membresía</span>
                      <CardTitle className="text-lg font-heading font-extrabold mt-1 text-foreground">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-1.5">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 py-2 space-y-6">
                      {/* Precio */}
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-heading font-black text-foreground">
                          S/. {plan.price.toFixed(0)}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">
                          /{getBillingCycleText(plan.billingCycle).toLowerCase()}
                        </span>
                      </div>

                      {/* Características detalladas */}
                      <ul className="space-y-3 pt-2">
                        <li className="flex items-center gap-2.5 text-xs">
                          <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                          <span className="text-foreground">Acceso 3D interactivo prioritario</span>
                        </li>
                        <li className="flex items-center gap-2.5 text-xs">
                          {plan.features.arEnabled ? (
                            <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                          ) : (
                            <span className="h-4.5 w-4.5 text-muted-foreground/30 shrink-0 text-center select-none font-bold block">-</span>
                          )}
                          <span className={plan.features.arEnabled ? 'text-foreground font-semibold' : 'text-muted-foreground/50'}>
                            Realidad Aumentada en móviles
                          </span>
                        </li>
                        <li className="flex items-center gap-2.5 text-xs">
                          {plan.features.premiumDiscounts ? (
                            <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                          ) : (
                            <span className="h-4.5 w-4.5 text-muted-foreground/30 shrink-0 text-center select-none font-bold block">-</span>
                          )}
                          <span className={plan.features.premiumDiscounts ? 'text-foreground font-semibold' : 'text-muted-foreground/50'}>
                            10% Descuento directo en catálogo
                          </span>
                        </li>
                        <li className="flex items-center gap-2.5 text-xs">
                          <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                          <span className="text-foreground">Envíos VIP y Soporte 24/7</span>
                        </li>
                      </ul>
                    </CardContent>
                  </div>

                  {/* Botón de compra / suscripción */}
                  <div className="p-6 pt-2">
                    <Button 
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={actionLoading}
                      className={`w-full rounded-2xl font-bold cursor-pointer h-11 px-6 active:scale-98 transition-all duration-300 shadow-md ${
                        isRecommended 
                          ? 'bg-primary hover:bg-primary/95 text-white shadow-primary/10' 
                          : 'bg-card text-foreground border border-primary/20 hover:bg-primary hover:text-white shadow-primary/5'
                      }`}
                    >
                      {actionLoading ? 'Procesando...' : 'Suscribirme Ahora'}
                      <ArrowRight className="h-4 w-4 ml-1.5 shrink-0" />
                    </Button>
                  </div>

                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
