'use client';

import { ProductCard } from './ProductCard';

export function ProductGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <p className="col-span-full text-center text-muted-foreground py-8">
        No products available
      </p>
    </div>
  );
}
