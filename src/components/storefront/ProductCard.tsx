'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Sparkles, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  sku?: string;
  has3D?: boolean;
}

export function ProductCard({ id, name, price, has3D = true }: ProductCardProps) {
  // Format price in local Peruvian Soles (S/)
  const formattedPrice = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(price);

  return (
    <Link href={`/catalog/${id}`} className="group block">
      <Card className="relative overflow-hidden border border-primary/10 bg-card/40 backdrop-blur-sm hover:bg-card/75 hover:border-primary/25 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 select-none">
        
        {/* Badge: 3D/AR Available */}
        {has3D && (
          <div className="absolute top-3 left-3 z-10">
            <span className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-wider text-primary-foreground bg-primary/80 backdrop-blur-md border border-white/20 rounded-full shadow-lg shadow-primary/20 uppercase animate-pulse">
              <Sparkles className="h-3 w-3 text-secondary" />
              <span>3D / AR</span>
            </span>
          </div>
        )}

        {/* Product Image / Custom 3D Art Placeholder */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/5 via-muted/30 to-secondary/5 flex items-center justify-center border-b border-primary/5">
          {/* Subtle Glowing Background Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40 group-hover:scale-110 transition-transform duration-500" />
          
          {/* Decorative Modern Art Circles */}
          <div className="absolute w-28 h-28 rounded-full border border-primary/10 group-hover:border-primary/20 scale-90 group-hover:scale-105 transition-all duration-500" />
          <div className="absolute w-20 h-20 rounded-full border border-secondary/15 group-hover:border-secondary/25 scale-90 group-hover:scale-110 transition-all duration-500" />
          
          {/* Rotating Sparkle / 3D Icon */}
          <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-500">
            <div className="w-12 h-12 rounded-xl bg-background/80 shadow-md border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Sparkles className="h-6 w-6 text-primary group-hover:text-secondary group-hover:animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          </div>

          {/* Quick Peek Action Overlay */}
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye className="h-4 w-4" />
              Explorar en 3D
            </span>
          </div>
        </div>

        {/* Card Details */}
        <CardContent className="p-5">
          {/* Product SKU */}
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
            MOCK-SKU
          </span>
          
          {/* Product Name */}
          <h3 className="font-heading font-bold text-sm sm:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300 mb-1.5">
            {name}
          </h3>
          
          {/* Price & Rating Row */}
          <div className="flex items-center justify-between">
            <span className="text-base sm:text-lg font-heading font-extrabold text-primary">
              {formattedPrice}
            </span>
            <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-semibold">
              Stock: Alto
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
