import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 gap-2">
            <Sparkles className="size-3" />
            Nueva Colección 2026
          </Badge>

          {/* Hero Title */}
          <h1 className="marketing-hero mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Experiencia de Compra 3D
          </h1>

          {/* Subtitle */}
          <p className="marketing-subtitle mx-auto mb-10">
            Descubre productos con realidad aumentada. Visualiza en 3D antes de
            comprar. La próxima generación del e-commerce ya está aquí.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="gap-2 text-base">
              Explorar Catálogo
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              Ver Demo 3D
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t pt-8">
            <div>
              <div className="text-4xl font-heading font-bold">1000+</div>
              <div className="text-sm text-muted-foreground mt-1">
                Productos 3D
              </div>
            </div>
            <div>
              <div className="text-4xl font-heading font-bold">50K+</div>
              <div className="text-sm text-muted-foreground mt-1">
                Clientes Felices
              </div>
            </div>
            <div>
              <div className="text-4xl font-heading font-bold">4.9</div>
              <div className="text-sm text-muted-foreground mt-1">
                Rating Promedio
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
