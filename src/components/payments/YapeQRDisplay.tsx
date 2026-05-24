'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Smartphone, Sparkles } from 'lucide-react';

interface YapeQRDisplayProps {
  amount: number;
  onConfirm?: () => void;
}

export function YapeQRDisplay({ amount, onConfirm }: YapeQRDisplayProps) {
  const [status, setStatus] = useState<'pending' | 'verifying' | 'confirmed'>('pending');
  const [countdown, setCountdown] = useState(300);

  useEffect(() => {
    const t = setInterval(() => setCountdown((p) => (p <= 0 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const fmtPrice = (v: number) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v);

  const handleSimulate = () => {
    setStatus('verifying');
    setTimeout(() => { setStatus('confirmed'); onConfirm?.(); }, 2000);
  };

  if (status === 'confirmed') {
    return (
      <div className="flex flex-col items-center gap-4 py-10 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-9 w-9 text-primary" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-heading font-extrabold text-base text-foreground">¡Pago confirmado!</p>
          <p className="text-xs text-muted-foreground">
            {fmtPrice(amount)} procesado con <span className="font-bold text-foreground">Yape</span>
          </p>
        </div>
      </div>
    );
  }

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground">Verificando con Yape...</p>
      </div>
    );
  }

  // QR SVG generation
  const size = 180; const cell = 7; const cols = Math.floor(size / cell);
  const qr = Array.from({ length: cols }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const tl = r < 7 && c < 7, tr = r < 7 && c > cols - 8, bl = r > cols - 8 && c < 7;
      if (tl || tr || bl) {
        const rr = r % 7, cc = c % 7;
        return (rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4)) ? 1 : 0;
      }
      return ((r * 31 + c * 17 + Math.floor(amount * 100)) % 7) < 3 ? 1 : 0;
    })
  );

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Brand header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6B21A8] to-[#EC4899] flex items-center justify-center shadow-md">
          <span className="text-white font-black text-base">Y</span>
        </div>
        <div>
          <p className="font-heading font-extrabold text-sm text-foreground">Paga con Yape</p>
          <p className="text-[10px] text-muted-foreground">Escanea el QR desde tu app</p>
        </div>
      </div>

      {/* Amount */}
      <div className="w-full bg-primary/5 border border-primary/15 rounded-xl px-5 py-3 text-center">
        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">Total a pagar</p>
        <p className="text-2xl font-heading font-black text-primary">{fmtPrice(amount)}</p>
      </div>

      {/* QR code */}
      <div className="relative bg-white rounded-2xl p-4 shadow-lg border border-primary/10">
        <svg width={size} height={size}>
          {qr.map((row, ri) =>
            row.map((cell, ci) =>
              cell ? (
                <rect key={`${ri}-${ci}`} x={ci * 7} y={ri * 7} width={6} height={6} fill="#6b21a8" rx={1} />
              ) : null
            )
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6B21A8] to-[#EC4899] flex items-center justify-center shadow-md border-2 border-white">
            <span className="text-white font-black text-sm">Y</span>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2 text-xs">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-muted-foreground font-semibold">Válido por:</span>
        <span className={`font-black tabular-nums ${countdown < 60 ? 'text-destructive' : 'text-foreground'}`}>
          {fmt(countdown)}
        </span>
      </div>

      {/* Steps */}
      <div className="w-full bg-muted/30 rounded-xl p-3.5 space-y-2 border border-primary/5">
        {['Abre tu app de Yape', 'Toca el ícono de QR', 'Apunta la cámara al código', 'Confirma el pago'].map((step, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[9px] font-black flex items-center justify-center shrink-0">{i + 1}</div>
            <p className="text-[10px] text-muted-foreground font-semibold">{step}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleSimulate}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-primary/10 hover:border-primary/30 rounded-xl px-4 py-2 hover:bg-primary/5 active:scale-95 font-semibold"
      >
        <Smartphone className="h-3.5 w-3.5" />
        Simular confirmación Yape (Demo)
      </button>
    </div>
  );
}
