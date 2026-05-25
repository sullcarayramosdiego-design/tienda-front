'use client';

import { useEffect, useState } from 'react';
import { useLoyalty } from '@/hooks/useLoyalty';
import type { LoyaltyTier, PointsTransaction } from '@/services/loyalty.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Trophy,
  Star,
  Zap,
  Crown,
  TrendingUp,
  RefreshCw,
  Gift,
  AlertCircle,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

// ─── Tier configuration ───────────────────────────────────────────────────────

const TIER_CONFIG: Record<
  LoyaltyTier,
  { label: string; icon: any; gradient: string; badge: string; shadow: string; description: string }
> = {
  BRONZE: {
    label: 'Bronce',
    icon: Star,
    gradient: 'from-amber-700 via-amber-600 to-amber-500',
    badge: 'bg-amber-500/15 text-amber-700 border-amber-400/40',
    shadow: 'shadow-amber-500/20',
    description: 'Miembro Inicial',
  },
  SILVER: {
    label: 'Plata',
    icon: Zap,
    gradient: 'from-slate-500 via-slate-400 to-slate-300',
    badge: 'bg-slate-400/15 text-slate-600 border-slate-400/40',
    shadow: 'shadow-slate-400/20',
    description: 'Miembro Frecuente',
  },
  GOLD: {
    label: 'Oro',
    icon: Trophy,
    gradient: 'from-yellow-600 via-yellow-500 to-amber-400',
    badge: 'bg-yellow-400/20 text-yellow-700 border-yellow-400/50',
    shadow: 'shadow-yellow-400/30',
    description: 'Miembro Premium',
  },
  PLATINUM: {
    label: 'Platino',
    icon: Crown,
    gradient: 'from-violet-600 via-purple-500 to-indigo-500',
    badge: 'bg-violet-500/15 text-violet-700 border-violet-400/40',
    shadow: 'shadow-violet-500/30',
    description: 'Miembro Élite',
  },
};

const TIER_ORDER: LoyaltyTier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TierProgressBar({
  currentTier,
  points,
  thresholds,
}: {
  currentTier: LoyaltyTier;
  points: number;
  thresholds: Record<LoyaltyTier, number>;
}) {
  const currentIdx = TIER_ORDER.indexOf(currentTier);

  return (
    <div className="flex items-center gap-2 w-full">
      {TIER_ORDER.map((tier, i) => {
        const Cfg = TIER_CONFIG[tier];
        const Icon = Cfg.icon;
        const reached = i <= currentIdx;
        const isActive = i === currentIdx;

        return (
          <div key={tier} className="flex items-center flex-1 last:flex-none">
            {/* Node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full w-9 h-9 transition-all duration-500 border-2',
                  reached
                    ? `bg-gradient-to-br ${Cfg.gradient} border-transparent ${isActive ? 'ring-2 ring-offset-2 ring-offset-card ring-primary/40 scale-110' : ''}`
                    : 'bg-muted border-border text-muted-foreground',
                )}
              >
                <Icon className={cn('h-4 w-4', reached ? 'text-white' : '')} />
              </div>
              <span
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wide',
                  isActive ? 'text-foreground' : reached ? 'text-muted-foreground' : 'text-muted-foreground/50',
                )}
              >
                {Cfg.label}
              </span>
              <span className="text-[9px] text-muted-foreground">
                {thresholds[tier].toLocaleString('es-PE')} pts
              </span>
            </div>

            {/* Connector */}
            {i < TIER_ORDER.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 rounded-full bg-border overflow-hidden mb-5">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-700',
                    i < currentIdx ? `bg-gradient-to-r ${TIER_CONFIG[TIER_ORDER[i + 1]].gradient}` : 'w-0',
                  )}
                  style={{ width: i < currentIdx ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TransactionRow({ tx }: { tx: PointsTransaction }) {
  const isPositive = tx.points > 0;
  const date = new Date(tx.createdAt).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0 group hover:bg-accent/30 px-2 rounded-lg -mx-2 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'h-7 w-7 rounded-full flex items-center justify-center text-xs font-black shrink-0',
            isPositive ? 'bg-emerald-500/15 text-emerald-600' : 'bg-primary/10 text-primary',
          )}
        >
          {isPositive ? '+' : '−'}
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground leading-tight line-clamp-1">{tx.reason}</p>
          <p className="text-[10px] text-muted-foreground">{date}</p>
        </div>
      </div>
      <span
        className={cn(
          'text-sm font-black shrink-0',
          isPositive ? 'text-emerald-600' : 'text-primary',
        )}
      >
        {isPositive ? '+' : ''}{tx.points.toLocaleString('es-PE')} pts
      </span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <Card className="border-border/50 bg-card/60 animate-pulse">
      <CardContent className="p-6 space-y-4">
        <div className="h-5 w-32 bg-muted rounded" />
        <div className="h-10 w-24 bg-muted rounded" />
        <div className="h-3 w-full bg-muted rounded-full" />
        <div className="h-3 w-2/3 bg-muted rounded-full" />
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoyaltyPage() {
  const { account, loading, error, redeeming, fetchAccount, redeemPoints } = useLoyalty();
  const { toast } = useToast();
  const [redeemInput, setRedeemInput] = useState('');

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const handleRedeem = async () => {
    const pts = parseInt(redeemInput, 10);
    if (isNaN(pts) || pts <= 0) {
      toast({ title: 'Cantidad inválida', description: 'Ingresa un número mayor a 0', type: 'error' });
      return;
    }
    const result = await redeemPoints(pts);
    if (result) {
      toast({
        type: 'success',
        title: '🎉 ¡Puntos canjeados!',
        description: `Obtuviste S/. ${result.discountAmount.toFixed(2)} de descuento. Puntos restantes: ${result.remainingPoints.toLocaleString('es-PE')}`,
      });
      setRedeemInput('');
    } else if (error) {
      toast({ title: 'Error al canjear', description: error, type: 'error' });
    }
  };

  const tier = account?.tier ?? 'BRONZE';
  const tierCfg = TIER_CONFIG[tier];
  const TierIcon = tierCfg.icon;
  const maxRedeemable = account ? Math.floor(account.points / 100) * 100 : 0;

  // ── Skeleton ──
  if (loading) {
    return (
      <section className="space-y-6">
        <div className="h-5 w-40 bg-muted rounded animate-pulse" />
        <SkeletonCard />
        <SkeletonCard />
      </section>
    );
  }

  // ── Error ──
  if (error && !account) {
    return (
      <section className="space-y-4">
        <h1 className="text-xl font-black">Club Puntos 3D</h1>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-5 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">Error al cargar puntos</p>
              <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchAccount} className="ml-auto text-xs">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-foreground">Club Puntos 3D</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Acumula puntos en cada compra y canjéalos por descuentos
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchAccount} className="text-xs gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Actualizar
        </Button>
      </div>

      {account && (
        <>
          {/* ── Tier Hero Card ── */}
          <Card
            className={cn(
              'border-0 overflow-hidden shadow-lg',
              tierCfg.shadow,
            )}
          >
            <div className={cn('bg-gradient-to-br h-2', tierCfg.gradient)} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left: points */}
                <div className="space-y-1">
                  <Badge variant="outline" className={cn('text-xs font-bold border', tierCfg.badge)}>
                    <TierIcon className="h-3 w-3 mr-1" />
                    {tierCfg.label} — {tierCfg.description}
                  </Badge>
                  <p className="text-4xl font-black text-foreground tabular-nums">
                    {account.points.toLocaleString('es-PE')}
                    <span className="text-base font-semibold text-muted-foreground ml-1.5">pts</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Equivale a{' '}
                    <span className="text-emerald-600 font-bold">S/. {account.discountValue.toFixed(2)}</span>{' '}
                    de descuento disponible
                  </p>
                </div>

                {/* Right: next tier */}
                {account.nextTier && (
                  <div className="text-right space-y-1">
                    <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                      Siguiente tier
                    </p>
                    <div className="flex items-center justify-end gap-1.5">
                      {(() => {
                        const NextIcon = TIER_CONFIG[account.nextTier].icon;
                        return (
                          <>
                            <NextIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-black text-foreground">
                              {TIER_CONFIG[account.nextTier].label}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                    <p className="text-xs text-primary font-semibold">
                      Faltan {account.pointsToNextTier.toLocaleString('es-PE')} pts
                    </p>
                    {/* Mini progress */}
                    <div className="mt-2 h-1.5 rounded-full bg-border w-36 overflow-hidden">
                      <div
                        className={cn('h-full rounded-full bg-gradient-to-r', tierCfg.gradient, 'transition-all duration-700')}
                        style={{
                          width: `${Math.min(
                            100,
                            ((account.points - (account.tierThresholds[tier] ?? 0)) /
                              Math.max(1, account.pointsToNextTier + account.points - (account.tierThresholds[tier] ?? 0))) *
                              100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {!account.nextTier && (
                  <div className="flex items-center gap-2 text-violet-600 font-black text-sm">
                    <Crown className="h-5 w-5" />
                    ¡Tier máximo alcanzado!
                  </div>
                )}
              </div>

              <Separator className="my-5" />

              {/* Tier progression */}
              <TierProgressBar
                currentTier={account.tier}
                points={account.points}
                thresholds={account.tierThresholds}
              />
            </CardContent>
          </Card>

          {/* ── Redeem Card ── */}
          <Card className="border-primary/10 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                Canjear Puntos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">100 puntos = S/. 1.00</span> de descuento en tu próxima compra.
                Mínimo 100 pts.
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline" size="icon" className="h-9 w-9 shrink-0"
                  onClick={() => setRedeemInput((v) => String(Math.max(0, (parseInt(v) || 0) - 100)))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  id="redeem-points-input"
                  type="number"
                  min={100}
                  step={100}
                  max={account.points}
                  placeholder="Cantidad de puntos"
                  value={redeemInput}
                  onChange={(e) => setRedeemInput(e.target.value)}
                  className="text-center font-bold h-9"
                />
                <Button
                  variant="outline" size="icon" className="h-9 w-9 shrink-0"
                  onClick={() => setRedeemInput((v) => String(Math.min(account.points, (parseInt(v) || 0) + 100)))}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {redeemInput && !isNaN(parseInt(redeemInput)) && parseInt(redeemInput) >= 100 && (
                <p className="text-xs text-emerald-600 font-semibold">
                  Obtendrás S/. {(Math.floor(parseInt(redeemInput) / 100)).toFixed(2)} de descuento
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  className="flex-1 gap-2"
                  onClick={handleRedeem}
                  disabled={redeeming || !redeemInput || parseInt(redeemInput) < 100 || parseInt(redeemInput) > account.points}
                >
                  {redeeming
                    ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Canjeando...</>
                    : <><Gift className="h-3.5 w-3.5" /> Canjear {redeemInput || '0'} pts</>
                  }
                </Button>
                {maxRedeemable > 0 && (
                  <Button
                    variant="outline" size="sm"
                    className="text-xs gap-1"
                    onClick={() => setRedeemInput(String(maxRedeemable))}
                  >
                    <TrendingUp className="h-3 w-3" />
                    Máximo ({maxRedeemable.toLocaleString('es-PE')})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── Transaction history ── */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Historial de Puntos
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Últimas {account.transactions.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {account.transactions.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Aún no tienes movimientos de puntos</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Completa tu primera compra para acumular puntos
                  </p>
                  <Button variant="ghost" size="sm" className="mt-3 gap-1.5 text-primary" asChild>
                    <a href="/catalog">
                      Ir al catálogo <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              ) : (
                <div>
                  {account.transactions.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Tier benefits info ── */}
          <Card className="border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-xs font-black text-foreground uppercase tracking-wider">
                  Beneficios por tier
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TIER_ORDER.map((t) => {
                  const Cfg = TIER_CONFIG[t];
                  const Icon = Cfg.icon;
                  const isCurrentOrHigher = TIER_ORDER.indexOf(t) <= TIER_ORDER.indexOf(tier);
                  return (
                    <div
                      key={t}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all',
                        isCurrentOrHigher
                          ? `border-transparent bg-gradient-to-br ${Cfg.gradient} shadow-sm`
                          : 'border-border/40 bg-muted/20',
                      )}
                    >
                      <Icon className={cn('h-5 w-5', isCurrentOrHigher ? 'text-white' : 'text-muted-foreground')} />
                      <span className={cn('text-[11px] font-black', isCurrentOrHigher ? 'text-white' : 'text-muted-foreground')}>
                        {Cfg.label}
                      </span>
                      <span className={cn('text-[9px]', isCurrentOrHigher ? 'text-white/80' : 'text-muted-foreground/60')}>
                        {account.tierThresholds[t].toLocaleString('es-PE')}+ pts
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}
