'use client';

import { ShoppingBag, Truck, Award, Wallet, ShieldCheck, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CheckoutOrderSummaryProps {
  items: Array<{ product: { id: string; name: string; price: number }; quantity: number }>;
  subtotal: number;
  premiumDiscount: number;
  loyaltyDiscount: number;
  shipping: number;
  grandTotal: number;
  pointsToEarn: number;
}

const fmt = (v: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v);

export function CheckoutOrderSummary({
  items,
  subtotal,
  premiumDiscount,
  loyaltyDiscount,
  shipping,
  grandTotal,
  pointsToEarn,
}: CheckoutOrderSummaryProps) {
  return (
    <Card className="border-primary/10 bg-card/60 backdrop-blur-md shadow-lg overflow-hidden sticky top-20">
      <CardContent className="p-0">
        {/* Header */}
        <div className="px-5 py-4 border-b border-primary/5 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-primary" />
          <h2 className="font-heading font-bold text-sm text-foreground">
            Resumen del pedido
          </h2>
          <span className="ml-auto text-[10px] font-bold text-muted-foreground">
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        {/* Items list */}
        <div className="divide-y divide-primary/5 max-h-52 overflow-y-auto">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center gap-3 px-5 py-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10 flex items-center justify-center shrink-0">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate leading-snug">{product.name}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">
                  {quantity} × {fmt(product.price)}
                </p>
              </div>
              <p className="text-xs font-extrabold text-primary shrink-0">
                {fmt(product.price * quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-5 py-4 space-y-2.5 border-t border-primary/5">
          <div className="flex justify-between text-xs text-muted-foreground font-semibold">
            <span>Subtotal</span>
            <span className="text-foreground font-bold">{fmt(subtotal)}</span>
          </div>

          {premiumDiscount > 0 && (
            <div className="flex justify-between text-xs font-semibold text-primary animate-fade-in">
              <span className="flex items-center gap-1">🏆 Descuento Premium VIP (10%)</span>
              <span className="font-bold">-{fmt(premiumDiscount)}</span>
            </div>
          )}

          {loyaltyDiscount > 0 && (
            <div className="flex justify-between text-xs font-semibold text-emerald-600 animate-fade-in">
              <span className="flex items-center gap-1">🎁 Descuento Club Puntos</span>
              <span className="font-bold">-{fmt(loyaltyDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Truck className="h-3 w-3" /> Envío
              {shipping === 0 && (
                <span className="px-1.5 py-0.5 text-[8px] font-black bg-[#00D47C]/15 border border-[#00D47C]/20 text-[#00AF66] rounded uppercase">
                  Gratis
                </span>
              )}
            </span>
            <span className={shipping === 0 ? 'text-[#00AF66] font-bold' : 'text-foreground font-bold'}>
              {shipping === 0 ? 'Gratis' : fmt(shipping)}
            </span>
          </div>

          {shipping > 0 && (
            <p className="text-[10px] text-muted-foreground leading-snug">
              * Agrega{' '}
              <span className="font-bold text-primary">{fmt(150 - subtotal)}</span> más para{' '}
              <strong>Envío Gratis</strong>
            </p>
          )}

          <div className="h-px bg-primary/5 my-1" />
          <div className="flex items-end justify-between">
            <span className="text-sm font-heading font-bold text-foreground">Total</span>
            <span className="text-xl font-heading font-black text-primary">{fmt(grandTotal)}</span>
          </div>
        </div>

        {/* Club 3D Points */}
        <div className="mx-5 mb-4 flex items-center gap-3 p-3 rounded-xl border border-primary/15 bg-primary/5">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Award className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-primary tracking-wider block">
              Club Puntos Acumulables
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">
              Ganarás <strong className="text-foreground font-extrabold">+{pointsToEarn.toLocaleString('es-PE')} Pts</strong> con este pedido
            </span>
          </div>
        </div>

        {/* Payment badges */}
        <div className="px-5 pb-4 space-y-2">
          <span className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1">
            <Wallet className="h-3 w-3 text-primary" /> Métodos disponibles
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'Yape',    color: 'text-[#00AF66]' },
              { label: 'Plin',    color: 'text-[#00A8A9]' },
              { label: 'Efectivo', color: 'text-[#E05300]' },
              { label: 'Tarjeta', color: 'text-primary' },
            ].map(({ label, color }) => (
              <div
                key={label}
                className={`px-1 py-1.5 text-center text-[8px] font-extrabold rounded-lg bg-card border border-primary/5 shadow-sm uppercase tracking-wider ${color}`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div className="px-5 pb-4 flex items-center gap-2 text-[10px] text-muted-foreground font-semibold">
          <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
          Transacciones seguras y encriptadas
        </div>
      </CardContent>
    </Card>
  );
}
