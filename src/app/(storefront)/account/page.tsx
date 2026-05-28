'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLoyalty } from '@/hooks/useLoyalty';
import { subscriptionService } from '@/services/subscription.service';
import { referralsService } from '@/services/referrals.service';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Award, 
  Sparkles, 
  Gift, 
  ShoppingBag, 
  User, 
  ShieldCheck, 
  TrendingUp, 
  ChevronRight, 
  ArrowRight,
  Calendar, 
  Mail,
  Zap,
  Star,
  Trophy,
  Crown
} from 'lucide-react';

const TIER_CONFIG: Record<string, { label: string; icon: any; gradient: string; badge: string }> = {
  BRONZE: { label: 'Bronce', icon: Star, gradient: 'from-amber-700 via-amber-600 to-amber-500', badge: 'bg-amber-500/10 text-amber-700 border-amber-500/20' },
  SILVER: { label: 'Plata', icon: Zap, gradient: 'from-slate-500 via-slate-400 to-slate-300', badge: 'bg-slate-400/10 text-slate-600 border-slate-400/20' },
  GOLD: { label: 'Oro', icon: Trophy, gradient: 'from-yellow-600 via-yellow-500 to-amber-400', badge: 'bg-yellow-400/10 text-yellow-600 border-yellow-400/20' },
  PLATINUM: { label: 'Platino', icon: Crown, gradient: 'from-violet-600 via-purple-500 to-indigo-500', badge: 'bg-violet-400/10 text-violet-700 border-violet-400/20' },
};

export default function AccountPage() {
  const { user } = useAuth();
  const { account, fetchAccount, loading: loyaltyLoading } = useLoyalty();
  const [subscription, setSubscription] = useState<any | null>(null);
  const [referralStats, setReferralStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        await fetchAccount();
        const [subData, refData] = await Promise.all([
          subscriptionService.getCurrentSubscription().catch(() => null),
          referralsService.getStats().catch(() => null),
        ]);
        setSubscription(subData);
        setReferralStats(refData);
      } catch (err) {
        console.error('Error al cargar datos del panel de control de cuenta:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [fetchAccount]);

  if (loading || loyaltyLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-44 rounded-3xl" />
          <Skeleton className="h-44 rounded-3xl" />
          <Skeleton className="h-44 rounded-3xl" />
        </div>
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>
    );
  }

  const tier = account?.tier || 'BRONZE';
  const tierCfg = TIER_CONFIG[tier] || TIER_CONFIG.BRONZE;
  const TierIcon = tierCfg.icon;

  // Verificar si la suscripción VIP está activa
  let isVipActive = false;
  if (subscription) {
    const now = new Date();
    isVipActive = subscription.status === 'ACTIVE' || (subscription.status === 'CANCELLED' && new Date(subscription.endDate) >= now);
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* 1. Panel de Bienvenida */}
      <section className="relative overflow-hidden p-6 sm:p-8 border border-primary/10 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent rounded-3xl backdrop-blur-sm">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl opacity-60" />
        
        <div className="relative z-10 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Resumen de cuenta</span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              ¡Hola de nuevo,{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                {user?.firstName || 'Cliente'}
              </span>!
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed flex items-center gap-1.5 font-semibold">
              <Mail className="h-3.5 w-3.5" /> {user?.email}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-bold">Nivel de Socio:</span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black border uppercase tracking-wider select-none ${tierCfg.badge}`}>
              <TierIcon className="h-3.5 w-3.5 shrink-0" />
              {tierCfg.label}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Cuadrícula de Módulos Operativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card: Club Puntos 3D */}
        <Card className="border-primary/10 bg-card/60 backdrop-blur-md hover:border-primary/20 transition-all duration-300 relative overflow-hidden group rounded-3xl flex flex-col justify-between shadow-md">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl group-hover:scale-125 transition-transform" />
          
          <CardHeader className="pb-2 border-b border-primary/5">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Club de Lealtad</span>
            <CardTitle className="text-base font-heading font-bold text-foreground flex items-center justify-between mt-0.5">
              Club Puntos 3D
              <Award className="h-4.5 w-4.5 text-primary" />
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <p className="text-3xl font-heading font-black text-foreground tabular-nums">
                {account?.points.toLocaleString('es-PE') || 0}
                <span className="text-xs font-bold text-muted-foreground ml-1">pts</span>
              </p>
              <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                Equivalente a <strong className="text-emerald-600">S/. {(account?.discountValue || 0).toFixed(2)}</strong> de descuento utilizable en tus compras.
              </p>
            </div>

            <Link href="/account/loyalty" className="inline-flex items-center gap-1 text-xs font-black text-primary hover:text-primary/80 transition-colors cursor-pointer group/link">
              Gestionar mis puntos
              <ChevronRight className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </CardContent>
        </Card>

        {/* Card: Suscripción Premium */}
        <Card className="border-primary/10 bg-card/60 backdrop-blur-md hover:border-primary/20 transition-all duration-300 relative overflow-hidden group rounded-3xl flex flex-col justify-between shadow-md">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-xl group-hover:scale-125 transition-transform" />
          
          <CardHeader className="pb-2 border-b border-primary/5">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Beneficios VIP</span>
            <CardTitle className="text-base font-heading font-bold text-foreground flex items-center justify-between mt-0.5">
              Suscripción Premium
              <Sparkles className="h-4.5 w-4.5 text-primary" />
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              {isVipActive ? (
                <>
                  <p className="text-lg font-heading font-black text-primary truncate">
                    {subscription.plan.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                    Membresía activa. Tienes envío prioritario gratuito y descuentos exclusivos en catálogo.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl font-heading font-black text-foreground">
                    Sin suscripción
                  </p>
                  <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                    Suscriberte te otorga AR móvil a escala real, envíos gratis VIP y soporte prioritario.
                  </p>
                </>
              )}
            </div>

            <Link href="/account/subscription" className="inline-flex items-center gap-1 text-xs font-black text-primary hover:text-primary/80 transition-colors cursor-pointer group/link">
              {isVipActive ? 'Ver beneficios y renovación' : 'Explorar membresías'}
              <ChevronRight className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </CardContent>
        </Card>

        {/* Card: Programa de Referidos */}
        <Card className="border-primary/10 bg-card/60 backdrop-blur-md hover:border-primary/20 transition-all duration-300 relative overflow-hidden group rounded-3xl flex flex-col justify-between shadow-md">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-gradient-to-br from-[#00D47C]/10 to-transparent rounded-full blur-xl group-hover:scale-125 transition-transform" />
          
          <CardHeader className="pb-2 border-b border-primary/5">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Ganar Puntos</span>
            <CardTitle className="text-base font-heading font-bold text-foreground flex items-center justify-between mt-0.5">
              Programa de Referidos
              <Gift className="h-4.5 w-4.5 text-[#00AF66]" />
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <p className="text-3xl font-heading font-black text-foreground tabular-nums">
                {referralStats?.totalReferrals || 0}
                <span className="text-xs font-bold text-muted-foreground ml-1">invitados</span>
              </p>
              <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                Has acumulado <strong className="text-primary">{(referralStats?.totalPointsEarned || 0).toLocaleString('es-PE')} pts</strong> invitando a tus amigos a la plataforma.
              </p>
            </div>

            <Link href="/account/referrals" className="inline-flex items-center gap-1 text-xs font-black text-primary hover:text-primary/80 transition-colors cursor-pointer group/link">
              Obtener mi código único
              <ChevronRight className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 3. Panel de Accesos Rápidos */}
      <Card className="border-primary/10 bg-card/40 rounded-3xl overflow-hidden shadow-sm">
        <CardHeader className="pb-3 border-b border-primary/5">
          <CardTitle className="text-base font-heading font-extrabold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Historial de compras
          </CardTitle>
          <CardDescription className="text-xs font-semibold text-muted-foreground">
            Consulta el estado de despacho de tus órdenes 3D anteriores.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground">¿Deseas rastrear un pedido en camino?</p>
            <p className="text-[11px] text-muted-foreground">Consulta las guías de envío y estados de tus despachos en tiempo real.</p>
          </div>
          <Button asChild className="rounded-xl font-bold cursor-pointer transition-all active:scale-[0.98]">
            <Link href="/account/orders">
              Ver mis pedidos
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
