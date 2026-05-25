import { ProductListIntegrated } from '@/components/storefront';
import { Suspense } from 'react';

export default function CatalogPage() {
  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-0">
      <Suspense fallback={
        <div className="py-20 text-center text-muted-foreground text-sm font-semibold animate-pulse">
          Cargando catálogo interactivo...
        </div>
      }>
        <ProductListIntegrated />
      </Suspense>
    </div>
  );
}