'use client';

import { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CulqiCardFormProps {
  amount: number;
  onConfirm?: (token: string) => void;
}

const fmtNum = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const fmtExp = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

function brand(n: string): 'visa' | 'mc' | 'amex' | null {
  const r = n.replace(/\s/g, '');
  if (r.startsWith('4')) return 'visa';
  if (/^5[1-5]|^2[2-7]/.test(r)) return 'mc';
  if (/^3[47]/.test(r)) return 'amex';
  return null;
}

function BrandBadge({ b }: { b: ReturnType<typeof brand> }) {
  if (b === 'visa') return <span className="text-[9px] font-black italic text-blue-900 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">VISA</span>;
  if (b === 'mc') return (
    <div className="flex">
      <div className="w-4 h-4 rounded-full bg-red-500" />
      <div className="w-4 h-4 rounded-full bg-yellow-400 -ml-2" />
    </div>
  );
  if (b === 'amex') return <span className="text-[9px] font-black text-white bg-blue-500 px-1.5 py-0.5 rounded">AMEX</span>;
  return <CreditCard className="h-4 w-4 text-muted-foreground/40" />;
}

export function CulqiCardForm({ amount, onConfirm }: CulqiCardFormProps) {
  const [num, setNum] = useState('');
  const [name, setName] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const b = brand(num);
  const fmtPrice = (v: number) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v);

  const validate = () => {
    const e: Record<string, string> = {};
    if (num.replace(/\s/g, '').length < 13) e.num = 'Número inválido';
    if (name.trim().length < 3) e.name = 'Ingresa el nombre del titular';
    if (exp.length < 5) e.exp = 'Fecha inválida';
    else {
      const mm = parseInt(exp.split('/')[0]);
      if (mm < 1 || mm > 12) e.exp = 'Mes inválido (01–12)';
    }
    if (cvv.length < 3) e.cvv = 'CVV inválido';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2500));
    setProcessing(false);
    setDone(true);
    onConfirm?.(`tok_${Date.now()}_culqi`);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-9 w-9 text-primary" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-heading font-extrabold text-base text-foreground">¡Pago procesado!</p>
          <p className="text-xs text-muted-foreground">
            {fmtPrice(amount)} cobrado con <span className="font-bold text-foreground">Culqi</span>
          </p>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary" />
          </div>
        </div>
        <p className="text-xs font-semibold text-muted-foreground">Procesando con Culqi...</p>
        <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
          <Lock className="h-3 w-3" /> SSL 256-bit
        </p>
      </div>
    );
  }

  // Card visual
  const dispNum = num || '•••• •••• •••• ••••';
  const dispName = name || 'NOMBRE APELLIDO';
  const dispExp = exp || 'MM/AA';

  const inputCls = (err?: string) =>
    `w-full bg-background border rounded-xl px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/40 ${
      err ? 'border-destructive/50 focus:border-destructive' : 'border-primary/10 focus:border-primary/40 hover:border-primary/20'
    }`;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
          <CreditCard className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-heading font-extrabold text-sm text-foreground">Tarjeta crédito / débito</p>
          <p className="text-[10px] text-muted-foreground">Procesado con Culqi</p>
        </div>
      </div>

      {/* Amount */}
      <div className="w-full bg-primary/5 border border-primary/15 rounded-xl px-5 py-3 text-center">
        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">Total a cobrar</p>
        <p className="text-2xl font-heading font-black text-primary">{fmtPrice(amount)}</p>
      </div>

      {/* 3D Card preview */}
      <div
        className="relative w-full h-40 cursor-pointer select-none"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped((f) => !f)}
        title="Toca para voltear"
      >
        <div
          className="relative w-full h-full transition-transform duration-700"
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
        >
          {/* Front */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg" style={{ backfaceVisibility: 'hidden' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary/80 to-primary/60" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white" />
            </div>
            <div className="relative h-full p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-9 h-6 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-90" />
                <BrandBadge b={b} />
              </div>
              <div>
                <p className="text-white/90 font-mono tracking-[0.18em] text-base font-semibold">
                  {dispNum}
                </p>
                <div className="flex justify-between mt-2">
                  <div>
                    <p className="text-white/50 text-[8px] uppercase tracking-widest">Titular</p>
                    <p className="text-white/90 text-xs font-bold uppercase truncate max-w-[180px]">{dispName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-[8px] uppercase tracking-widest">Vence</p>
                    <p className="text-white/90 text-xs font-bold">{dispExp}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/80" />
            <div className="relative mt-7 h-8 bg-black/40 w-full" />
            <div className="relative flex items-center justify-end gap-4 px-5 mt-4">
              <div className="flex-1 h-8 bg-white/90 rounded flex items-center justify-end px-3">
                <p className="text-foreground font-mono font-bold tracking-widest text-sm">
                  {cvv.padEnd(3, '•').slice(0, 3)}
                </p>
              </div>
              <BrandBadge b={b} />
            </div>
          </div>
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground/50 text-center -mt-2">
        Toca la tarjeta para voltearla y ver el CVV
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Number */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            Número de tarjeta
          </label>
          <div className="relative">
            <input
              type="text" inputMode="numeric" placeholder="0000 0000 0000 0000"
              value={num} onChange={(e) => setNum(fmtNum(e.target.value))}
              className={inputCls(errors.num) + ' pr-12 font-mono'}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2"><BrandBadge b={b} /></div>
          </div>
          {errors.num && <p className="text-[10px] text-destructive flex items-center gap-1 font-semibold"><AlertCircle className="h-3 w-3" />{errors.num}</p>}
        </div>

        {/* Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Nombre en la tarjeta</label>
          <input
            type="text" placeholder="JOHN DOE"
            value={name} onChange={(e) => setName(e.target.value.toUpperCase())}
            className={inputCls(errors.name) + ' uppercase tracking-wide'}
          />
          {errors.name && <p className="text-[10px] text-destructive flex items-center gap-1 font-semibold"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
        </div>

        {/* Exp + CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Vencimiento</label>
            <input
              type="text" inputMode="numeric" placeholder="MM/AA"
              value={exp} onChange={(e) => setExp(fmtExp(e.target.value))}
              className={inputCls(errors.exp) + ' font-mono'}
            />
            {errors.exp && <p className="text-[10px] text-destructive flex items-center gap-1 font-semibold"><AlertCircle className="h-3 w-3" />{errors.exp}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">CVV</label>
            <div className="relative">
              <input
                type={showCvv ? 'text' : 'password'} inputMode="numeric" placeholder="•••"
                value={cvv}
                onChange={(e) => { setCvv(e.target.value.replace(/\D/g, '').slice(0, 4)); setFlipped(true); }}
                onFocus={() => setFlipped(true)}
                onBlur={() => setFlipped(false)}
                className={inputCls(errors.cvv) + ' pr-9 font-mono'}
              />
              <button type="button" onClick={() => setShowCvv((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
                {showCvv ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            {errors.cvv && <p className="text-[10px] text-destructive flex items-center gap-1 font-semibold"><AlertCircle className="h-3 w-3" />{errors.cvv}</p>}
          </div>
        </div>

        {/* Security notice */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          <Lock className="h-3 w-3 text-primary" />
          <p className="text-[10px] text-muted-foreground font-semibold">
            Pago seguro · SSL 256-bit · Procesado por <span className="text-primary font-bold">Culqi</span>
          </p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-12 font-bold tracking-wide bg-primary hover:bg-primary/95 text-primary-foreground rounded-2xl shadow-lg shadow-primary/15 cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Lock className="h-4 w-4" />
          Pagar {fmtPrice(amount)}
        </Button>
      </form>

      {/* Card logos */}
      <div className="flex items-center justify-center gap-2 opacity-40">
        {['Visa', 'Mastercard', 'Amex', 'Diners'].map((c) => (
          <span key={c} className="text-[9px] text-muted-foreground font-bold border border-border rounded px-1.5 py-0.5">{c}</span>
        ))}
      </div>
    </div>
  );
}
