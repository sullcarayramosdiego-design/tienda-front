'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ProductViewer3D = dynamic(
  () => import('@/features/catalog').then((mod) => mod.ProductViewer3D),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-full bg-muted/10 flex flex-col items-center justify-center overflow-hidden">
        <Skeleton className="absolute inset-0 bg-gradient-to-r from-muted/5 via-muted/10 to-muted/5 animate-pulse rounded-none" />
        <div className="absolute inset-8 lg:inset-16 border border-border/20 rounded-[2rem] pointer-events-none flex flex-col items-center justify-center">
          <div className="space-y-4 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground/30 font-mono animate-pulse">
              [ INICIALIZANDO ENTORNO 3D ]
            </span>
            <div className="w-24 h-[1px] bg-border/20 mx-auto" />
            <span className="text-[9px] uppercase tracking-[0.1em] font-medium text-foreground/20 font-mono block animate-pulse">
              Tolerancia Geométrica Superior
            </span>
          </div>
        </div>
      </div>
    ),
  }
);

export function MarketingHero() {
  return (
    <section className="relative w-full min-h-[100dvh] bg-background text-foreground overflow-hidden flex flex-col lg:flex-row">
      {/* 
        ========================================================
        LEFT COLUMN: "THE EDITORIAL SPLIT" - Typography & Intent
        ========================================================
      */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 lg:py-0 z-10 relative">
        <div className="absolute inset-0 bg-background -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12 max-w-xl"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground font-mono">
              Arquitectura Digital
            </span>
          </div>

          {/* Massive Display Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05]">
            <span className="block text-muted-foreground">Realidad</span>
            <span className="block text-foreground">Tangible.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-sm">
            Examinación espacial sin fricción. Interactúa con objetos en alta fidelidad antes de que existan físicamente en tus manos.
          </p>

          {/* Double-Bezel CTA with Hover Physics */}
          <div className="pt-4 flex">
            <motion.div 
              whileTap={{ scale: 0.98 }} 
              className="group relative inline-flex"
            >
              <Link 
                href="/catalog"
                className="relative inline-flex items-center gap-6 rounded-full bg-primary text-primary-foreground pl-8 pr-2 py-2 font-bold uppercase tracking-[0.1em] text-xs transition-colors hover:bg-primary/90"
              >
                <span>Descubrir Catálogo</span>
                {/* Button-in-Button architecture */}
                <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* 
        ========================================================
        RIGHT COLUMN: THE 3D CANVAS (Absolute Hero)
        ========================================================
      */}
      <div className="w-full lg:w-[55%] relative min-h-[60vh] lg:min-h-[100dvh] bg-card lg:border-l border-border flex items-center justify-center overflow-hidden">
        {/* Subtle geometric framing */}
        <div className="absolute inset-8 lg:inset-16 border border-border/50 rounded-[2rem] pointer-events-none" />

        <div className="absolute inset-0 lg:inset-12 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <ProductViewer3D className="w-full h-full cursor-grab active:cursor-grabbing" scale={2.5} />
          </motion.div>
        </div>

        {/* Floating helper text */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 pointer-events-none mix-blend-difference">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground font-mono text-center">
            [ ARRASTRA PARA EXPLORAR ]
          </span>
        </div>
      </div>
    </section>
  );
}
