'use client';

import { CheckCircle2, Clock, Package, RefreshCw, RotateCcw, Truck, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/features/checkout/types/order';

// ─── Status config ────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: any; step: number }
> = {
  PENDING:    { label: 'Pendiente',    color: 'bg-amber-500/15 text-amber-600 border-amber-300/30',     icon: Clock,          step: 1 },
  CONFIRMED:  { label: 'Confirmada',   color: 'bg-blue-500/15 text-blue-600 border-blue-300/30',        icon: CheckCircle2,   step: 2 },
  PROCESSING: { label: 'Procesando',   color: 'bg-violet-500/15 text-violet-600 border-violet-300/30',  icon: RefreshCw,      step: 3 },
  SHIPPED:    { label: 'Enviada',      color: 'bg-cyan-500/15 text-cyan-600 border-cyan-300/30',        icon: Truck,          step: 4 },
  DELIVERED:  { label: 'Entregada',    color: 'bg-emerald-500/15 text-emerald-600 border-emerald-300/30', icon: Package,      step: 5 },
  CANCELLED:  { label: 'Cancelada',    color: 'bg-red-500/15 text-red-600 border-red-300/30',           icon: XCircle,        step: 0 },
  REFUNDED:   { label: 'Reembolsada',  color: 'bg-slate-500/15 text-slate-500 border-slate-300/30',     icon: RotateCcw,      step: 0 },
};

const PROGRESS_STEPS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <Badge
      variant="outline"
      className={cn('flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border', cfg.color)}
    >
      <Icon className="h-3 w-3" />
      {cfg.label}
    </Badge>
  );
}

export function OrderProgressBar({ status }: { status: OrderStatus }) {
  const currentStep = STATUS_CONFIG[status].step;
  if (currentStep === 0) return null; // CANCELLED / REFUNDED no tienen barra lineal

  return (
    <div className="flex items-center gap-0 mt-3">
      {PROGRESS_STEPS.map((s, i) => {
        const step = i + 1;
        const done = step < currentStep;
        const active = step === currentStep;
        const Icon = STATUS_CONFIG[s].icon;
        return (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div
              className={cn(
                'flex items-center justify-center rounded-full w-6 h-6 shrink-0 text-[10px] transition-all duration-300',
                done   && 'bg-primary text-primary-foreground',
                active && 'bg-primary/20 border-2 border-primary text-primary',
                !done && !active && 'bg-muted text-muted-foreground border border-border',
              )}
            >
              <Icon className="h-3 w-3" />
            </div>
            {i < PROGRESS_STEPS.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-1 rounded-full transition-all duration-500',
                  done ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
