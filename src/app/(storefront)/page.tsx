'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth';
import { MarketingHero } from '@/features/engagement';
import { motion, useReducedMotion } from 'motion/react';
import { 
  ArrowRight, 
  Box, 
  Layers, 
  Zap,
  Check
} from 'lucide-react';
import { subscriptionService, type SubscriptionPlan } from '@/features/subscriptions';
import { UserDashboardDynamic } from './components/UserDashboardDynamic';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const reduce = useReducedMotion();

  const [plans, setPlans] = React.useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = React.useState(true);

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

  if (isAuthenticated && user) {
    return <UserDashboardDynamic />;
  }

  // Guest view - Branding Aware (Forcing Dark Mode)
  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* 1. MARKETING HERO */}
      <MarketingHero />

      {/* 2. FEATURES (The Asymmetrical Bento) */}
      <section className="py-32 md:py-40 px-6 md:px-12 lg:px-20 border-t border-border">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="mb-20 max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-foreground">
              El Corazón <br />
              <span className="text-muted-foreground">De Nuestra Tierra.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Conectamos el arte popular del Perú con el mundo, traduciendo significados ancestrales y permitiendo la apreciación detallada en 3D y realidad aumentada.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,_auto)]">
            
            {/* Cell 1 */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-8 md:row-span-2 relative group rounded-[2rem] bg-card/50 border border-border p-2 overflow-hidden"
            >
              <div className="absolute inset-2 bg-card rounded-[calc(2rem-0.5rem)] shadow-sm p-8 md:p-12 flex flex-col justify-end overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <Box className="w-12 h-12 text-muted-foreground/30 group-hover:text-primary transition-colors duration-700" strokeWidth={1} />
                </div>
                
                <div className="relative z-10 max-w-md">
                  <h3 className="text-3xl font-bold tracking-tight mb-4 text-foreground">Traducción Cultural</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Cada pieza tradicional cuenta una historia. Traducimos la cosmovisión y el significado profundo de los símbolos y técnicas de nuestros artesanos.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Cell 2 */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-4 relative group rounded-[2rem] bg-card/50 border border-border p-2"
            >
              <div className="absolute inset-2 bg-card rounded-[calc(2rem-0.5rem)] shadow-sm p-8 flex flex-col justify-between">
                <Layers className="w-8 h-8 text-primary/50" strokeWidth={1} />
                <div>
                  <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">Modelado 3D & AR</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Interactúa y proyecta retablos, máscaras y ceramios en tu espacio real para apreciar el relieve de la arcilla y madera.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Cell 3 */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-4 relative group rounded-[2rem] bg-card/50 border border-border p-2"
            >
              <div className="absolute inset-2 bg-card rounded-[calc(2rem-0.5rem)] shadow-sm p-8 flex flex-col justify-between">
                <Zap className="w-8 h-8 text-secondary/50" strokeWidth={1} />
                <div>
                  <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">Comercio Justo</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Cada pieza adquirida beneficia directamente a los maestros artesanos peruanos y a la preservación de sus talleres tradicionales.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. PRICING (The Z-Axis Cascade) */}
      <section className="py-32 md:py-40 px-6 md:px-12 lg:px-20 bg-muted/20 border-t border-border overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="mb-24 text-center max-w-3xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground font-mono">
                Membresías Culturales
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-foreground">
              Apoya y Descubre <br />
              <span className="text-muted-foreground">Nuestra Cultura.</span>
            </h2>
          </div>

          {loadingPlans ? (
            <div className="text-center text-muted-foreground font-mono text-sm uppercase tracking-widest animate-pulse">
              Obteniendo protocolos de acceso...
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center text-muted-foreground font-mono text-sm uppercase">
              Sistemas no disponibles.
            </div>
          ) : (
            <div className="relative flex flex-col md:flex-row justify-center items-center md:items-stretch gap-8 md:gap-0 mt-16">
              {plans.map((plan, index) => {
                const isRecommended = plan.name.toLowerCase().includes('plata') || index === 1;
                const zAxisStyles = !isRecommended && index === 0 
                  ? "md:translate-x-12 md:rotate-[-2deg] md:z-0 md:scale-95 md:opacity-70 md:hover:opacity-100 md:hover:z-30 md:hover:rotate-0 md:hover:scale-100" 
                  : !isRecommended && index === 2 
                  ? "md:-translate-x-12 md:rotate-[2deg] md:z-0 md:scale-95 md:opacity-70 md:hover:opacity-100 md:hover:z-30 md:hover:rotate-0 md:hover:scale-100"
                  : "z-20 md:scale-105 shadow-2xl shadow-primary/5";

                return (
                  <motion.div 
                    key={plan.id}
                    initial={reduce ? false : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full max-w-sm relative group rounded-[2rem] p-2 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] bg-card border border-border ${zAxisStyles}`}
                  >
                    <div className={`h-full rounded-[calc(2rem-0.5rem)] shadow-sm p-10 flex flex-col ${isRecommended ? 'bg-primary/5 border border-primary/20' : 'bg-card'}`}>
                      {isRecommended && (
                        <div className="absolute top-6 right-6">
                          <span className="px-3 py-1 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                            Pilar Central
                          </span>
                        </div>
                      )}
                      
                      <div className="mb-10">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground font-mono block mb-2">
                          Nivel
                        </span>
                        <h3 className="text-2xl font-bold tracking-tight mb-2 text-foreground">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed min-h-[40px]">
                          {plan.description}
                        </p>
                      </div>

                      <div className="mb-12">
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-black tracking-tighter text-foreground">
                            S/. {plan.price.toFixed(0)}
                          </span>
                          <span className="text-muted-foreground font-mono text-sm">/mes</span>
                        </div>
                      </div>

                      <ul className="space-y-4 mb-12 flex-1">
                        <li className="flex items-start gap-4">
                          <Check className="w-5 h-5 text-primary shrink-0" strokeWidth={1.5} />
                          <span className="text-sm text-foreground/80">Traducción cultural e historias de piezas</span>
                        </li>
                        <li className="flex items-start gap-4">
                          {plan.features.arEnabled ? (
                            <Check className="w-5 h-5 text-primary shrink-0" strokeWidth={1.5} />
                          ) : (
                            <span className="w-5 h-5 flex items-center justify-center text-muted-foreground/30">-</span>
                          )}
                          <span className={`text-sm ${plan.features.arEnabled ? 'text-foreground/80' : 'text-muted-foreground/50'}`}>
                            Visualización en Realidad Aumentada
                          </span>
                        </li>
                        <li className="flex items-start gap-4">
                          {plan.features.premiumDiscounts ? (
                            <Check className="w-5 h-5 text-primary shrink-0" strokeWidth={1.5} />
                          ) : (
                            <span className="w-5 h-5 flex items-center justify-center text-muted-foreground/30">-</span>
                          )}
                          <span className={`text-sm ${plan.features.premiumDiscounts ? 'text-foreground/80' : 'text-muted-foreground/50'}`}>
                            10% de descuento de apoyo al artesano
                          </span>
                        </li>
                      </ul>

                      <motion.div whileTap={{ scale: 0.98 }}>
                        <Link 
                          href="/login"
                          className={`w-full h-12 flex items-center justify-center rounded-full font-bold uppercase tracking-[0.1em] text-xs transition-colors duration-500 ${
                            isRecommended 
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                              : 'bg-secondary/10 text-secondary-foreground border border-secondary/20 hover:bg-secondary/20'
                          }`}
                        >
                          Adquirir Acceso
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
