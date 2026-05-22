import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Mobile First */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
            {/* Left Column - Content */}
            <div className="flex flex-col justify-center space-y-6 lg:space-y-8 lg:flex-1">
              {/* Badge */}
              <div className="inline-flex self-start">
                <Badge className="gap-2 text-xs sm:text-sm bg-primary/90 text-primary-foreground border-primary hover:bg-primary">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  Nueva Experiencia 3D
                </Badge>
              </div>

              {/* Headline - Responsive Typography */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight leading-tight">
                  Descubre el futuro del{' '}
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    E-Commerce en 3D
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Explora productos con visualización 3D interactiva y realidad
                  aumentada. Toca, rota y examina cada detalle antes de comprar.
                </p>
              </div>

              {/* CTA Buttons - Full Width on Mobile */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  size="lg" 
                  asChild 
                  className="w-full sm:w-auto gap-2 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  <Link href="/catalog">
                    Explorar Catálogo
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild 
                  className="w-full sm:w-auto text-base border-primary/30 hover:bg-primary/5"
                >
                  <Link href="/catalog">Ver Productos 3D</Link>
                </Button>
              </div>

              {/* Stats - Responsive Grid */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-4 sm:pt-6">
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-primary">1000+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Productos 3D
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-primary">50K+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Clientes
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-primary">4.9★</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Valoración
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - 3D Viewer Placeholder - Responsive */}
            <div className="flex items-center justify-center lg:justify-end lg:flex-1 mt-8 lg:mt-0">
              <div className="relative w-full max-w-md lg:max-w-xl">
                {/* Glow Effect Background */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-50" />
                
                {/* 3D Canvas Container */}
                <div className="relative aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 rounded-2xl lg:rounded-3xl border-2 border-dashed border-muted-foreground/20 shadow-xl flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center space-y-3 sm:space-y-4 p-6 sm:p-8">
                      <div className="h-12 w-12 sm:h-16 sm:w-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ring-4 ring-primary/10">
                        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                      </div>
                      <p className="text-sm sm:text-base font-medium text-foreground">
                        Visor 3D Interactivo
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Canvas de React Three Fiber se integrará aquí
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced Mobile Layout */}
      <section className="py-12 sm:py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-3 sm:mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Revolucionamos el e-commerce con tecnología 3D de vanguardia
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-background p-6 sm:p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 sm:mb-6 ring-2 ring-primary/10">
                <svg
                  className="h-6 w-6 sm:h-7 sm:w-7 text-primary"
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
              <h3 className="text-lg sm:text-xl font-heading font-semibold mb-2 sm:mb-3">
                Visualización 3D
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Explora productos con modelos 3D interactivos de alta calidad
              </p>
            </div>

            <div className="bg-background p-6 sm:p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 flex items-center justify-center mb-4 sm:mb-6 ring-2 ring-secondary/10">
                <svg
                  className="h-6 w-6 sm:h-7 sm:w-7 text-secondary"
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
              <h3 className="text-lg sm:text-xl font-heading font-semibold mb-2 sm:mb-3">
                Realidad Aumentada
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Prueba cómo se ve en tu espacio antes de comprar con AR
              </p>
            </div>

            <div className="bg-background p-6 sm:p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 sm:mb-6 ring-2 ring-primary/10">
                <svg
                  className="h-6 w-6 sm:h-7 sm:w-7 text-primary"
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
              <h3 className="text-lg sm:text-xl font-heading font-semibold mb-2 sm:mb-3">
                Carga Instantánea
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Modelos optimizados que cargan rápido sin sacrificar calidad
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
