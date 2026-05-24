import { ProductListIntegrated } from '@/components/storefront/ProductListIntegrated';
import { Sparkles, ShoppingBag } from 'lucide-react';

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 pb-20">
      
      {/* Premium Hero Title Banner */}
      <section className="relative overflow-hidden pt-12 pb-10 border-b border-primary/5 mb-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest rounded-full animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" />
            <span>Colección Completa 2026</span>
          </div>

          <h1 className="text-4.5xl sm:text-5.5xl md:text-6.5xl font-heading font-extrabold tracking-tight leading-tight">
            Catálogo{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Interactivo 3D
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Explora nuestra selecta línea de productos con visualización 3D interactiva en tiempo real y soporte para Realidad Aumentada. Toca, rota y vive la experiencia antes de comprar.
          </p>
        </div>
      </section>

      {/* Main Interactive Catalog Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductListIntegrated />
      </main>
    </div>
  );
}