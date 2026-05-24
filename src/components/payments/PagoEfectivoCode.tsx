'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Copy, RefreshCw } from 'lucide-react';

interface PagoEfectivoCodeProps {
  amount: number;
  onConfirm?: () => void;
}

function generateCIP(amount: number): string {
  return `1${Date.now().toString().slice(-4)}${String(Math.floor(amount * 100)).slice(-4).padStart(4, '0')}`;
}

export function PagoEfectivoCode({ amount, onConfirm }: PagoEfectivoCodeProps) {
  const [status, setStatus] = useState<'pending' | 'confirmed'>('pending');
  const [copied, setCopied] = useState(false);
  const [cip] = useState(() => generateCIP(amount));
  const [remaining, setRemaining] = useState(72 * 3600);

  useEffect(() => {
    const t = setInterval(() => setRemaining((p) => (p <= 0 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const fmtPrice = (v: number) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v);
  const fmtExpiry = (s: number) => `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cip).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'confirmed') {
    return (
      <div className="flex flex-col items-center gap-4 py-10 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-9 w-9 text-primary" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-heading font-extrabold text-base text-foreground">¡Pago verificado!</p>
          <p className="text-xs text-muted-foreground">
            {fmtPrice(amount)} confirmado con <span className="font-bold text-foreground">PagoEfectivo</span>
          </p>
        </div>
      </div>
    );
  }

  const payPoints = [
    { name: 'Kasnet', color: 'text-blue-500' },
    { name: 'Western Union', color: 'text-yellow-600' },
    { name: 'Agente BCP', color: 'text-blue-700' },
    { name: 'Tambo+', color: 'text-red-500' },
    { name: 'Full Carga', color: 'text-green-600' },
    { name: 'Agente BBVA', color: 'text-blue-500' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Brand header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E05300] to-[#F97316] flex items-center justify-center shadow-md">
          <span className="text-white font-black text-[10px] leading-tight text-center">PE</span>
        </div>
        <div>
          <p className="font-heading font-extrabold text-sm text-foreground">PagoEfectivo</p>
          <p className="text-[10px] text-muted-foreground">Paga en efectivo con tu código CIP</p>
        </div>
      </div>

      {/* Amount */}
      <div className="w-full bg-primary/5 border border-primary/15 rounded-xl px-5 py-3 text-center">
        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">Total a pagar</p>
        <p className="text-2xl font-heading font-black text-primary">{fmtPrice(amount)}</p>
      </div>

      {/* CIP Code */}
      <div className="bg-card border border-primary/10 rounded-xl p-4 space-y-2">
        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground text-center">
          Tu código CIP
        </p>
        <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3 border border-primary/5">
          <p className="flex-1 text-xl font-mono font-black tracking-[0.25em] text-foreground text-center">
            {cip}
          </p>
          <button
            onClick={handleCopy}
            className={`shrink-0 p-1.5 rounded-lg transition-all active:scale-90 ${
              copied
                ? 'bg-primary/20 text-primary'
                : 'bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary'
            }`}
          >
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 pt-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
          <p className="text-[10px] text-muted-foreground font-semibold">
            Válido por: <span className="text-foreground font-bold">{fmtExpiry(remaining)}</span>
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-muted/30 rounded-xl p-3.5 space-y-2 border border-primary/5">
        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Pasos</p>
        {[
          'Anota o copia tu código CIP',
          'Dirígete a un punto de pago',
          'Indica que pagas con PagoEfectivo',
          'Proporciona el CIP y paga el monto exacto',
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
            <p className="text-[10px] text-muted-foreground font-semibold">{step}</p>
          </div>
        ))}
      </div>

      {/* Pay points */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-2">
          Puntos de pago disponibles
        </p>
        <div className="flex flex-wrap gap-1.5">
          {payPoints.map((p) => (
            <span
              key={p.name}
              className={`text-[10px] rounded-lg px-2.5 py-1 border border-primary/10 bg-card font-bold ${p.color}`}
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => { setStatus('confirmed'); onConfirm?.(); }}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-primary/10 hover:border-primary/30 rounded-xl px-4 py-2 hover:bg-primary/5 active:scale-95 font-semibold self-center"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Simular pago en efectivo (Demo)
      </button>
    </div>
  );
}
