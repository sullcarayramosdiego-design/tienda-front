'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PriceRangeSliderProps {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
}

const presets = [
  { label: 'Todos', min: undefined, max: undefined },
  { label: 'Bajo S/ 100', min: undefined, max: 100 },
  { label: 'S/ 100 - S/ 500', min: 100, max: 500 },
  { label: 'S/ 500 - S/ 1500', min: 500, max: 1500 },
  { label: 'Sobre S/ 1500', min: 1500, max: undefined },
];

export function PriceRangeSlider({ minPrice, maxPrice, onPriceChange }: PriceRangeSliderProps) {
  const [minInput, setMinInput] = useState<string>(minPrice !== undefined ? String(minPrice) : '');
  const [maxInput, setMaxInput] = useState<string>(maxPrice !== undefined ? String(maxPrice) : '');

  // Keep inputs in sync if props change externally (e.g., filter reset)
  useEffect(() => {
    setMinInput(minPrice !== undefined ? String(minPrice) : '');
  }, [minPrice]);

  useEffect(() => {
    setMaxInput(maxPrice !== undefined ? String(maxPrice) : '');
  }, [maxPrice]);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = minInput === '' ? undefined : Number(minInput);
    const maxVal = maxInput === '' ? undefined : Number(maxInput);
    
    if (minVal !== undefined && maxVal !== undefined && minVal > maxVal) {
      // Auto-swap if min is greater than max
      onPriceChange(maxVal, minVal);
      setMinInput(String(maxVal));
      setMaxInput(String(minVal));
    } else {
      onPriceChange(minVal, maxVal);
    }
  };

  const handlePresetClick = (presetMin: number | undefined, presetMax: number | undefined) => {
    setMinInput(presetMin !== undefined ? String(presetMin) : '');
    setMaxInput(presetMax !== undefined ? String(presetMax) : '');
    onPriceChange(presetMin, presetMax);
  };

  const isPresetActive = (pMin: number | undefined, pMax: number | undefined) => {
    return minPrice === pMin && maxPrice === pMax;
  };

  return (
    <Card className="border-primary/10 bg-card/60 backdrop-blur-md shadow-lg">
      <CardHeader className="pb-3 border-b border-primary/5">
        <CardTitle className="text-sm font-heading font-bold uppercase tracking-wider text-muted-foreground">
          Rango de Precio
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Quick Range Presets */}
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset, idx) => {
            const active = isPresetActive(preset.min, preset.max);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetClick(preset.min, preset.max)}
                className={cn(
                  "text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all duration-300 active:scale-95 cursor-pointer",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/15"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Custom Range Inputs */}
        <form onSubmit={handleApplyCustom} className="space-y-3 pt-1">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-bold">
                S/
              </span>
              <Input
                type="number"
                placeholder="Mín"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                className="pl-8 h-9 border-primary/10 bg-background/50 focus-visible:ring-primary/30"
              />
            </div>
            <span className="text-muted-foreground text-xs font-semibold">a</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-bold">
                S/
              </span>
              <Input
                type="number"
                placeholder="Máx"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                className="pl-8 h-9 border-primary/10 bg-background/50 focus-visible:ring-primary/30"
              />
            </div>
          </div>
          
          <Button
            type="submit"
            size="sm"
            className="w-full h-8 text-[11px] font-bold tracking-wider uppercase bg-primary hover:bg-primary/95 text-primary-foreground cursor-pointer active:scale-[0.98]"
          >
            Aplicar Filtro
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
