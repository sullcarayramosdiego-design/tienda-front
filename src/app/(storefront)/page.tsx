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

const FALLBACK_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_bronce',
    name: 'Membresía Ayllu',
    description: 'Apoyo básico para el sustento de talleres artesanos y acceso a crónicas culturales exclusivas.',
    price: 15,
    billingCycle: 'MONTHLY',
    features: { priority3D: false, arEnabled: false, premiumDiscounts: false },
    isActive: true,
    createdAt: '2026-06-15T00:00:00.000Z',
    updatedAt: '2026-06-15T00:00:00.000Z'
  },
  {
    id: 'plan_plata',
    name: 'Membresía Chasqui',
    description: 'Acceso ilimitado a visualizaciones 3D/AR en tiempo real, encuentros interactivos y soporte prioritario.',
    price: 30,
    billingCycle: 'MONTHLY',
    features: { priority3D: true, arEnabled: true, premiumDiscounts: false },
    isActive: true,
    createdAt: '2026-06-15T00:00:00.000Z',
    updatedAt: '2026-06-15T00:00:00.000Z'
  },
  {
    id: 'plan_oro',
    name: 'Membresía Inka',
    description: 'La experiencia cultural definitiva. Descuentos exclusivos de apoyo directo, eventos privados con maestros y piezas exclusivas.',
    price: 50,
    billingCycle: 'MONTHLY',
    features: { priority3D: true, arEnabled: true, premiumDiscounts: true },
    isActive: true,
    createdAt: '2026-06-15T00:00:00.000Z',
    updatedAt: '2026-06-15T00:00:00.000Z'
  }
];

const PLAN_BRAND_MAPPING: Record<string, { name: string; description: string }> = {
  'plan_bronce': {
    name: 'Membresía Ayllu',
    description: 'Apoyo básico para el sustento de talleres artesanos y acceso a crónicas culturales exclusivas.'
  },
  'plan_plata': {
    name: 'Membresía Chasqui',
    description: 'Visualización interactiva en 3D y realidad aumentada, encuentros virtuales con artesanos y atención preferencial.'
  },
  'plan_oro': {
    name: 'Membresía Inka',
    description: 'Acceso exclusivo a piezas de colección histórica, eventos y talleres interactivos privados con maestros artesanos, y prioridad de reserva.'
  }
};

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
        console.error('Error al cargar planes en landing, usando fallback:', err);
        setPlans(FALLBACK_PLANS);
      } finally {
        setLoadingPlans(false);
      }
    }
    loadPlans();
  }, []);

  if (isAuthenticated && user) {
    return <UserDashboardDynamic />;
  }

  const planTiers = ["01 · Conexión", "02 · Inmersión", "03 · Mecenazgo"];

  // Guest view - Branding Aware
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* 1. MARKETING HERO */}
      <MarketingHero />

      {/* 2. FEATURES (The Asymmetrical Bento) */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-t border-border">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="mb-16 max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] leading-[1.05] mb-6 text-foreground text-balance">
              El Corazón <br />
              <span className="text-primary italic font-normal font-heading">de Nuestra Tierra.</span>
            </h2>
            <p className="text-base md:text-lg text-foreground/80 leading-[1.6] max-w-[65ch]">
              Conectamos el arte popular peruano con el mundo. Revelamos la cosmovisión de cada pieza a través de modelado 3D y realidad aumentada.
            </p>
          </div>

          {/* Bento Grid with flat tonal depth and maximum 12px rounding */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(280px,_auto)]">
            
            {/* Cell 1: Cosmovisión (Large) */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="md:col-span-8 md:row-span-2 relative group rounded-[12px] bg-muted/40 border border-border p-8 md:p-12 flex flex-col justify-between overflow-hidden min-h-[380px] transition-all duration-300 hover:border-primary/45"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-[10px] bg-background border border-border flex items-center justify-center text-primary">
                  <Box className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-primary font-bold uppercase bg-background border border-border px-3 py-1 rounded-[10px]">
                  Cosmovisión
                </span>
              </div>
              
              <div className="max-w-md mt-12">
                <h3 className="text-2xl md:text-3xl font-heading font-extrabold tracking-[-0.02em] mb-4 text-foreground">Historias y Cosmovisión</h3>
                <p className="text-foreground/90 text-sm md:text-base leading-[1.6]">
                  Cada obra guarda un relato andino. Revelamos el simbolismo y las técnicas ancestrales que los maestros artesanos plasman en su creación.
                </p>
              </div>
            </motion.div>

            {/* Cell 2: 3D & AR (Small) */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="md:col-span-4 relative group rounded-[12px] bg-card border border-border p-8 flex flex-col justify-between min-h-[280px] transition-all duration-300 hover:border-primary/45"
            >
              <div className="w-10 h-10 rounded-[10px] bg-muted/60 border border-border flex items-center justify-center text-primary">
                <Layers className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div className="mt-6">
                <h3 className="text-lg md:text-xl font-heading font-extrabold tracking-[-0.02em] mb-2 text-foreground">Inmersión en 3D y AR</h3>
                <p className="text-foreground/90 text-xs md:text-sm leading-[1.6]">
                  Interactúa y proyecta piezas tradicionales en tu espacio. Aprecia el relieve de la arcilla y la madera tallada con absoluta fidelidad.
                </p>
              </div>
            </motion.div>

            {/* Cell 3: Comercio Justo (Small, Image-Drenched) */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
              className="md:col-span-4 relative group rounded-[12px] border border-border/80 flex flex-col justify-between min-h-[280px] transition-all duration-300 hover:border-primary/45 overflow-hidden"
            >
              {/* Background Image with dark overlay */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=600&fit=crop" 
                  alt="Maestro Artesano del Perú" 
                  className="w-full h-full object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-105"
                />
              </div>

              <div className="w-10 h-10 rounded-[10px] bg-black/60 border border-white/20 flex items-center justify-center text-primary">
                <Zap className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div className="mt-6 relative z-20">
                <h3 className="text-lg md:text-xl font-heading font-extrabold tracking-[-0.02em] mb-2 text-white">Apoyo Directo a Talleres</h3>
                <p className="text-white/90 text-xs md:text-sm leading-[1.6]">
                  Apoya la continuidad del oficio. El 100% de los fondos de mecenazgo llega directamente a las familias de las comunidades artesanas.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2.5 THE SEQUENCE (El Camino del Arte) */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-t border-border bg-background">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="mb-20 max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] leading-[1.05] mb-6 text-foreground text-balance">
              El Recorrido de <br />
              <span className="text-primary italic font-normal font-heading">Cada Obra Maestra.</span>
            </h2>
            <p className="text-base md:text-lg text-foreground/80 leading-[1.6] max-w-[65ch]">
              Un recorrido honesto y transparente desde los talleres altoandinos hasta tu colección.
            </p>
          </div>

          {/* 3 Step Sequence Grid - Styled as a horizontal timeline with top-border connectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 mt-12">
            
            {/* Step 1 */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="flex flex-col group border-t border-border pt-8 hover:border-primary/45 transition-colors duration-300"
            >
              <div className="text-xs font-mono tracking-widest text-primary font-bold mb-3 select-none">
                01 · ORIGEN
              </div>
              <h3 className="text-lg md:text-xl font-heading font-extrabold tracking-[-0.02em] text-foreground mb-3">
                Curaduría Directa
              </h3>
              <p className="text-foreground/80 text-sm md:text-base leading-[1.6]">
                Viajamos a Cusco, Puno y Ayacucho para seleccionar piezas auténticas de herencia viva.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="flex flex-col group border-t border-border pt-8 hover:border-primary/45 transition-colors duration-300"
            >
              <div className="text-xs font-mono tracking-widest text-primary font-bold mb-3 select-none">
                02 · REGISTRO
              </div>
              <h3 className="text-lg md:text-xl font-heading font-extrabold tracking-[-0.02em] text-foreground mb-3">
                Preservación Digital
              </h3>
              <p className="text-foreground/80 text-sm md:text-base leading-[1.6]">
                Capturamos cada obra con fotogrametría en 3D/AR para salvaguardar su relieve, textura y trazo original.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
              className="flex flex-col group border-t border-border pt-8 hover:border-primary/45 transition-colors duration-300"
            >
              <div className="text-xs font-mono tracking-widest text-primary font-bold mb-3 select-none">
                03 · IMPACTO
              </div>
              <h3 className="text-lg md:text-xl font-heading font-extrabold tracking-[-0.02em] text-foreground mb-3">
                Comercio Sostenible
              </h3>
              <p className="text-foreground/80 text-sm md:text-base leading-[1.6]">
                Conectamos tu aporte directo con el artesano para asegurar el legado de las nuevas generaciones.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. PRICING (The Z-Axis Cascade) */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-muted/20 border-t border-border overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="mb-20 text-center max-w-3xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 border border-border/80 bg-background px-3 py-1 rounded-[10px] mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.15em] font-medium text-foreground/80 font-mono">
                Membresías Culturales
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-[-0.03em] leading-[1.05] mb-6 text-foreground text-balance">
              Apoya y Descubre <br />
              <span className="text-primary italic font-normal font-heading">Nuestra Cultura.</span>
            </h2>
          </div>

          {loadingPlans ? (
            <div className="text-center text-foreground/70 font-mono text-xs uppercase tracking-widest animate-pulse py-12">
              Preparando experiencias culturales...
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center text-foreground/75 font-mono text-xs uppercase py-12">
              No pudimos cargar las membresías. Por favor, inténtalo de nuevo más tarde.
            </div>
          ) : (
            <div className="relative flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6 md:gap-4 lg:gap-6 mt-12 group/plans">
              {plans.map((plan, index) => {
                const mappedPlan = PLAN_BRAND_MAPPING[plan.id] || { name: plan.name, description: plan.description };
                const isRecommended = plan.id === 'plan_plata' || plan.name.toLowerCase().includes('chasqui') || plan.name.toLowerCase().includes('plata') || index === 1;
                
                // Clean subtle Z-axis styling with 12px rounded borders (avoiding banned excessive 32px rounds)
                const cardTransformStyles = !isRecommended && index === 0 
                  ? "md:translate-x-6 md:rotate-[-1deg] md:z-0 md:scale-[0.97] md:opacity-85 md:hover:rotate-0" 
                  : !isRecommended && index === 2 
                  ? "md:-translate-x-6 md:rotate-[1deg] md:z-0 md:scale-[0.97] md:opacity-85 md:hover:rotate-0"
                  : "z-20 md:scale-[1.02] border-primary/30 shadow-md";
 
                return (
                  <motion.div 
                    key={plan.id}
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full max-w-sm relative group rounded-[12px] p-8 md:p-10 flex flex-col transition-all duration-500 border ${
                      isRecommended 
                        ? 'bg-primary/5 border-primary/40 shadow-md' 
                        : 'bg-card border-border'
                    } ${cardTransformStyles} group-hover/plans:opacity-50 hover:!opacity-100 hover:!scale-[1.03] hover:z-30`}
                  >
                    {isRecommended && (
                      <div className="absolute top-4 right-4">
                        <span className="px-2.5 py-1 bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-[0.15em] rounded-[10px]">
                          Recomendado
                        </span>
                      </div>
                    )}
                    
                    <div className="mb-8">
                      <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-primary font-mono block mb-1">
                        {planTiers[index] || `0${index + 1} · Plan`}
                      </span>
                      <h3 className="text-xl md:text-2xl font-heading font-bold tracking-tight mb-2 text-foreground">
                        {mappedPlan.name}
                      </h3>
                      <p className="text-xs md:text-sm text-foreground/85 leading-relaxed min-h-[48px]">
                        {mappedPlan.description}
                      </p>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-foreground">
                          S/. {plan.price.toFixed(0)}
                        </span>
                        <span className="text-foreground/70 font-mono text-xs">/mes</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1 border-t border-border/60 pt-6">
                      <li className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="text-xs md:text-sm text-foreground/90">Cosmovisión y significado de piezas</span>
                      </li>
                      <li className="flex items-start gap-3">
                        {plan.features.arEnabled ? (
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2} />
                        ) : (
                          <span className="w-4 h-4 flex items-center justify-center text-muted-foreground/30 text-xs shrink-0 mt-0.5">-</span>
                        )}
                        <span className={`text-xs md:text-sm ${plan.features.arEnabled ? 'text-foreground/90' : 'text-foreground/60'}`}>
                          Visualización en Realidad Aumentada
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        {plan.features.premiumDiscounts ? (
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2} />
                        ) : (
                          <span className="w-4 h-4 flex items-center justify-center text-muted-foreground/30 text-xs shrink-0 mt-0.5">-</span>
                        )}
                        <span className={`text-xs md:text-sm ${plan.features.premiumDiscounts ? 'text-foreground/90' : 'text-foreground/60'}`}>
                          Descuento de apoyo al artesano
                        </span>
                      </li>
                    </ul>

                    <motion.div whileTap={{ scale: 0.98 }} className="mt-auto">
                      <Link 
                        href="/login"
                        className={`w-full h-11 flex items-center justify-center font-bold uppercase tracking-[0.05em] text-[10px] transition-all duration-200 ${
                          isRecommended 
                            ? 'bg-primary text-primary-foreground hover:bg-[#1c7d73]' 
                            : 'bg-muted text-foreground border border-border hover:bg-muted-foreground/10'
                        }`}
                        style={{ borderRadius: '10px' }}
                      >
                        {plan.id === 'plan_bronce' ? 'Unirse a Ayllu' : plan.id === 'plan_plata' ? 'Unirse a Chasqui' : plan.id === 'plan_oro' ? 'Unirse a Inka' : 'Elegir Plan'}
                      </Link>
                    </motion.div>
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
