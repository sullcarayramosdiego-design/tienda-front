'use client';

import { Award, Minus, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface LoyaltyRedemptionProps {
  /** Puntos disponibles del usuario */
  availablePoints: number;
  /** Puntos actualmente canjeados */
  redeemedPoints: number;
  /** Valor del input controlado */
  pointsInput: string;
  /** Callback al cambiar la cantidad de puntos */
  onPointsChange: (input: string, redeemed: number) => void;
}

export function LoyaltyRedemption({
  availablePoints,
  redeemedPoints,
  pointsInput,
  onPointsChange,
}: LoyaltyRedemptionProps) {
  const maxRedeemable = Math.floor(availablePoints / 100) * 100;
  const loyaltyDiscount = redeemedPoints / 100;

  const decrement = () => {
    const newPts = Math.max(0, redeemedPoints - 100);
    onPointsChange(newPts > 0 ? String(newPts) : '', newPts);
  };

  const increment = () => {
    const newPts = Math.min(maxRedeemable, redeemedPoints + 100);
    onPointsChange(String(newPts), newPts);
  };

  const handleInputChange = (raw: string) => {
    const val = parseInt(raw) || 0;
    const rounded = Math.floor(val / 100) * 100;
    onPointsChange(raw, val >= 0 && val <= availablePoints ? rounded : redeemedPoints);
  };

  return (
    <Card className="border-primary/10 bg-card/60 backdrop-blur-md shadow-lg overflow-hidden mt-4">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Award className="h-5 w-5 animate-pulse" />
          <h3 className="font-heading font-bold text-sm text-foreground">Canjear Puntos Club 3D</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Tienes <strong className="text-foreground">{availablePoints.toLocaleString('es-PE')} pts</strong>.{' '}
          Puedes canjearlos en múltiplos de 100 por un descuento directo de{' '}
          <strong className="text-emerald-600">S/. 1.00 por cada 100 pts</strong>.
        </p>

        <div className="flex items-center gap-2 max-w-xs">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 cursor-pointer"
            onClick={decrement}
            disabled={redeemedPoints <= 0}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            min={100}
            step={100}
            max={maxRedeemable}
            placeholder="Cantidad de puntos"
            value={pointsInput}
            onChange={(e) => handleInputChange(e.target.value)}
            className="text-center font-bold h-9"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 cursor-pointer"
            onClick={increment}
            disabled={redeemedPoints >= maxRedeemable}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {redeemedPoints > 0 && (
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 animate-fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            ¡Descuento de S/. {loyaltyDiscount.toFixed(2)} aplicado exitosamente!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
