'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, Banknote, Zap } from 'lucide-react';
import { YapeQRDisplay } from './YapeQRDisplay';
import { PlinQRDisplay } from './PlinQRDisplay';
import { PagoEfectivoCode } from './PagoEfectivoCode';
import { CulqiCardForm } from './CulqiCardForm';

interface PaymentTabsProps {
  amount: number;
  onPaymentComplete?: (method: string) => void;
}

const METHODS = [
  { id: 'culqi',        label: 'Tarjeta',   icon: CreditCard, desc: 'Visa / MC / Amex' },
  { id: 'yape',         label: 'Yape',      icon: Zap,        desc: 'QR Instantáneo'   },
  { id: 'plin',         label: 'Plin',      icon: Smartphone, desc: 'QR Bancario'       },
  { id: 'pagoefectivo', label: 'Efectivo',  icon: Banknote,   desc: 'Código CIP'        },
] as const;

type MethodId = (typeof METHODS)[number]['id'];

export function PaymentTabs({ amount, onPaymentComplete }: PaymentTabsProps) {
  const [active, setActive] = useState<MethodId>('culqi');

  return (
    <div className="space-y-4">
      {/* Tab selector */}
      <div className="grid grid-cols-4 gap-2">
        {METHODS.map(({ id, label, icon: Icon, desc }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all text-center ${
                isActive
                  ? 'border-primary bg-primary/5 text-primary shadow-sm'
                  : 'border-primary/10 text-muted-foreground hover:border-primary/20 hover:bg-muted/30'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-muted/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-[10px] font-extrabold leading-none">{label}</span>
              <span className="text-[8px] text-muted-foreground/60 leading-none hidden sm:block">{desc}</span>
              {isActive && (
                <div className="absolute -bottom-px left-3 right-3 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="min-h-80">
        {active === 'culqi' && (
          <CulqiCardForm amount={amount} onConfirm={() => onPaymentComplete?.('culqi')} />
        )}
        {active === 'yape' && (
          <YapeQRDisplay amount={amount} onConfirm={() => onPaymentComplete?.('yape')} />
        )}
        {active === 'plin' && (
          <PlinQRDisplay amount={amount} onConfirm={() => onPaymentComplete?.('plin')} />
        )}
        {active === 'pagoefectivo' && (
          <PagoEfectivoCode amount={amount} onConfirm={() => onPaymentComplete?.('pagoefectivo')} />
        )}
      </div>
    </div>
  );
}
