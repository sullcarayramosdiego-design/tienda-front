import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div className="flex flex-col justify-center space-y-8">
              {/* Badge */}
              <div>
                <Badge variant="secondary" className="gap-2 text-sm">
                  <Sparkles className="size-4" />
                  Nueva Experiencia 3D
                </Badge>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-heading font-extrabold tracking-tight leading-tight">
                  Descubre el futuro del{' '}
                  <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                    E-Commerce en 3D
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Explora productos con visualización 3D interactiva y realidad
                  aumentada. Toca, rota y examina cada detalle antes de comprar.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="gap-2 text-base">
                  <Link href="/catalog">
                    Explorar Catálogo
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base">
                  <Link href="/catalog">Ver Productos 3D</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-heading font-bold">1000+</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Productos 3D
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-bold">50K+</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Clientes
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-bold">4.9★</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Valoración
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - 3D Viewer Placeholder */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-xl aspect-square">
                {/* Placeholder for React Three Fiber Canvas */}
                <div className="absolute inset-0 bg-muted rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <div className="text-center space-y-3 p-8">
                    <div className="size-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="size-8 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Visor 3D Interactivo
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Canvas de React Three Fiber se integrará aquí
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-muted-foreground">
              Revolucionamos el e-commerce con tecnología 3D de vanguardia
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-background p-6 rounded-xl border">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  className="size-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">
                Visualización 3D
              </h3>
              <p className="text-muted-foreground">
                Explora productos con modelos 3D interactivos de alta calidad
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  className="size-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">
                Realidad Aumentada
              </h3>
              <p className="text-muted-foreground">
                Prueba cómo se ve en tu espacio antes de comprar con AR
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  className="size-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">
                Carga Instantánea
              </h3>
              <p className="text-muted-foreground">
                Modelos optimizados que cargan rápido sin sacrificar calidad
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
