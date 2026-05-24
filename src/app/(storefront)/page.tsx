'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductViewer3D } from '@/components/viewer3d/ProductViewer3D';
import { ProductListIntegrated } from '@/components/storefront/ProductListIntegrated';
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Award, 
  Heart, 
  LayoutDashboard, 
  User,
  Activity,
  Box3d
} from 'lucide-react';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  // ==========================================
  // 1. CUSTOMER DASHBOARD (Authenticated View)
  // ==========================================
  if (isAuthenticated && user) {
    return (
      <div className="space-y-10 animate-fade-in pb-10">
        
        {/* Welcome Header Hero Banner */}
        <section className="relative overflow-hidden p-6 sm:p-8 md:p-10 border border-primary/10 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent rounded-3xl backdrop-blur-sm">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl opacity-60" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <Badge className="gap-2 text-xs bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-secondary" />
                <span>Sesión Activa</span>
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight">
                ¡Hola de nuevo,{' '}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  {user.firstName}
                </span>!
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                Bienvenido a tu portal de compras 3D. Explora nuevos modelos en realidad aumentada, consulta tus pedidos y canjea tus puntos acumulados.
              </p>
            </div>

            <div className="flex gap-3">
              <Button asChild size="lg" className="rounded-2xl bg-primary hover:bg-primary/95 shadow-md shadow-primary/15 font-bold cursor-pointer h-12 px-6 active:scale-98">
                <Link href="/catalog" className="flex items-center gap-2">
                  <span>Ir al Catálogo 3D</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Client KPI Stats Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card: Puntos Club 3D */}
          <Card className="relative overflow-hidden border border-primary/10 bg-card/60 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Programa de Lealtad</span>
              <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 mt-1">
                <Award className="h-4.5 w-4.5 text-primary" />
                Puntos Club 3D
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
                1,250 <span className="text-sm font-bold text-muted-foreground font-sans">Pts</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                ¡Tienes S/ 25.00 de descuento listos para canjear en modelos físicos!
              </p>
            </CardContent>
          </Card>

          {/* Card: Pedidos Activos */}
          <Card className="relative overflow-hidden border border-primary/10 bg-card/60 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Entregas en camino</span>
              <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 mt-1">
                <ShoppingBag className="h-4.5 w-4.5 text-primary" />
                Mis Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
                2 <span className="text-sm font-bold text-muted-foreground font-sans">Activos</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Tus pedidos se encuentran en camino y llegarán hoy a tu domicilio.
              </p>
            </CardContent>
          </Card>

          {/* Card: Favoritos */}
          <Card className="relative overflow-hidden border border-primary/10 bg-card/60 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Lista de Deseos</span>
              <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 mt-1">
                <Heart className="h-4.5 w-4.5 text-primary" />
                Favoritos Guardados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
                4 <span className="text-sm font-bold text-muted-foreground font-sans">Productos</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Explora y mantente al tanto si tus favoritos tienen descuentos.
              </p>
            </CardContent>
          </Card>
        </section>

        <hr className="border-primary/5" />

        {/* Dashboard Catalog Explorer Section */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-foreground tracking-tight">
              Explorar Catálogo de Productos
            </h2>
          </div>
          <ProductListIntegrated />
        </section>

      </div>
    );
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
                  className="w-full sm:w-auto gap-2 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 cursor-pointer h-12"
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
              <div className="relative w-full max-w-md lg:max-w-xl">
                {/* Glow Effect Background */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-50" />
                
                {/* 3D Canvas / model-viewer Container */}
                <ProductViewer3D />
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
