'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth';
import { useProducts } from '@/features/inventory';
import { ProductCard } from '@/features/catalog';
import dynamic from 'next/dynamic';

const ProductViewer3D = dynamic(
  () => import('@/features/catalog').then((mod) => mod.ProductViewer3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-muted/20 border border-primary/5 rounded-3xl gap-3">
        <div className="relative">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          <div className="absolute inset-0 h-8 w-8 bg-primary/20 blur-xl rounded-full" />
        </div>
        <span className="text-xs text-muted-foreground font-semibold">Cargando visualizador 3D...</span>
      </div>
    ),
  }
);
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Award, 
  Heart, 
  Truck,
  RotateCcw,
  Sparkle,
  Clock,
  ExternalLink,
  Zap,
  XCircle,
  Check
} from 'lucide-react';
import { subscriptionService, type SubscriptionPlan } from '@/features/subscriptions';
import { UserDashboardDynamic } from './components/UserDashboardDynamic';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  // Plans state for Guest Pricing Section
  const [plans, setPlans] = React.useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = React.useState(true);

  // Load plans for the guest landing view
  React.useEffect(() => {
    async function loadPlans() {
      try {
        setLoadingPlans(true);
        const data = await subscriptionService.getPlans();
        setPlans(data);
      } catch (err) {
        console.error('Error al cargar planes en landing:', err);
      } finally {
        setLoadingPlans(false);
      }
    }
    loadPlans();
  }, []);

  // ==========================================
  // 1. WELL-STRUCTURED CUSTOMER DASHBOARD (Logged-In)
  // ==========================================
  if (isAuthenticated && user) {
    return <UserDashboardDynamic />;
  }

  // ==========================================
  // 2. PUBLIC MARKETING HERO (Guest View)
  // ==========================================
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
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Explora productos con visualización 3D interactiva y realidad
                  aumentada. Toca, rota y examina cada detalle antes de comprar.
                </p>
              </div>

              {/* CTA Buttons - Full Width on Mobile */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  size="lg" 
                  asChild 
                  className="w-full sm:w-auto gap-2 text-base bg-primary hover:bg-primary/95 shadow-lg shadow-primary/20 cursor-pointer h-12"
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
                  className="w-full sm:w-auto text-base border-primary/30 hover:bg-primary/5 h-12 cursor-pointer"
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

            {/* Right Column - 3D Viewer - Responsive */}
            <div className="flex items-center justify-center lg:justify-end lg:flex-1 mt-8 lg:mt-0 w-full">
              <div className="relative w-full max-w-md lg:max-w-xl h-[450px] sm:h-[500px] lg:h-[600px]">
                {/* Glow Effect Background */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-50" />
                
                {/* 3D Canvas / model-viewer Container */}
                <ProductViewer3D className="w-full h-full" />
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

      {/* Pricing / Plans Section */}
      <section className="py-16 sm:py-24 bg-background border-t border-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
            <Badge className="gap-2 text-xs bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-secondary" />
              <span>Planes Club Premium 3D</span>
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-foreground">
              Membresías VIP exclusivas
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Desbloquea Realidad Aumentada interactiva, descuentos automáticos en catálogo, envíos exprés gratuitos y acumulación de puntos acelerada.
            </p>
          </div>

          {loadingPlans ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto animate-pulse">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-96 rounded-3xl bg-primary/5 border border-primary/5" />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-10">
              No hay planes de suscripción disponibles en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch">
              {plans.map((plan) => {
                const isRecommended = plan.name.toLowerCase().includes('plata');
                return (
                  <Card 
                    key={plan.id}
                    className={`border rounded-3xl overflow-hidden relative flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${
                      isRecommended 
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5 ring-1 ring-primary/50' 
                        : 'border-primary/10 bg-card/60'
                    }`}
                  >
                    {isRecommended && (
                      <div className="absolute top-0 right-0 left-0 bg-primary text-primary-foreground text-center py-1 text-[10px] font-black uppercase tracking-widest">
                        Plan Recomendado
                      </div>
                    )}

                    <div>
                      <CardHeader className={`pb-4 ${isRecommended ? 'pt-8' : 'pt-6'}`}>
                        <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Membresía</span>
                        <CardTitle className="text-lg font-heading font-extrabold mt-1 text-foreground">
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="text-[11px] text-muted-foreground leading-relaxed mt-1.5">
                          {plan.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="px-6 py-2 space-y-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-heading font-black text-foreground">
                            S/. {plan.price.toFixed(0)}
                          </span>
                          <span className="text-xs font-bold text-muted-foreground">
                            /mes
                          </span>
                        </div>

                        <ul className="space-y-3 pt-2">
                          <li className="flex items-center gap-2.5 text-xs">
                            <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                            <span className="text-foreground">Acceso 3D interactivo prioritario</span>
                          </li>
                          <li className="flex items-center gap-2.5 text-xs">
                            {plan.features.arEnabled ? (
                              <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                            ) : (
                              <span className="h-4.5 w-4.5 text-muted-foreground/30 shrink-0 text-center select-none font-bold block">-</span>
                            )}
                            <span className={plan.features.arEnabled ? 'text-foreground font-semibold' : 'text-muted-foreground/50'}>
                              Realidad Aumentada en móviles
                            </span>
                          </li>
                          <li className="flex items-center gap-2.5 text-xs">
                            {plan.features.premiumDiscounts ? (
                              <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                            ) : (
                              <span className="h-4.5 w-4.5 text-muted-foreground/30 shrink-0 text-center select-none font-bold block">-</span>
                            )}
                            <span className={plan.features.premiumDiscounts ? 'text-foreground font-semibold' : 'text-muted-foreground/50'}>
                              10% Descuento directo en catálogo
                            </span>
                          </li>
                          <li className="flex items-center gap-2.5 text-xs">
                            <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                            <span className="text-foreground">Envíos VIP y Soporte 24/7</span>
                          </li>
                        </ul>
                      </CardContent>
                    </div>

                    <div className="p-6 pt-2">
                      <Button 
                        asChild
                        className={`w-full rounded-2xl font-bold cursor-pointer h-11 px-6 active:scale-98 transition-all duration-300 shadow-md ${
                          isRecommended 
                            ? 'bg-primary hover:bg-primary/95 text-white shadow-primary/10' 
                            : 'bg-card text-foreground border border-primary/20 hover:bg-primary hover:text-white shadow-primary/5'
                        }`}
                      >
                        <Link href="/login">
                          Registrarme y Suscribirme <ArrowRight className="h-4 w-4 ml-1.5 shrink-0" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
