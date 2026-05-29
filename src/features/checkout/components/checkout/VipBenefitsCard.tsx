'use client';

import { ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface VipBenefitsCardProps {
  premiumDiscountPercentage: number;
  freeShippingApplied: boolean;
}

export function VipBenefitsCard({
  premiumDiscountPercentage,
  freeShippingApplied,
}: VipBenefitsCardProps) {
  return (
    <Card className="border-primary/15 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent shadow-lg overflow-hidden mt-4">
      <CardContent className="p-5 flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <ShieldCheck className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-black uppercase text-primary tracking-wider">
            Beneficios VIP Premium Activos
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
            {premiumDiscountPercentage > 0 && '✓ Descuento premium del 10% en catálogo. '}
            {freeShippingApplied && '✓ Envío prioritario totalmente gratuito.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
