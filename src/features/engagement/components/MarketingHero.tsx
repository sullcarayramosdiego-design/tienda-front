'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
              Cultura, Arte & Traducción
            </span>
          </div>

          {/* Massive Display Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05]">
            <span className="block text-muted-foreground">Siente el alma</span>
            <span className="block text-foreground">de los Andes.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-sm">
            Explora el arte popular peruano y la cosmovisión detrás de cada pieza a través de traducción cultural e interactividad inmersiva.
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
                <span>Explorar Catálogo</span>
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
        RIGHT COLUMN: THE VISUAL STATEMENT (Premium Photography)
        ========================================================
      */}
      <div className="w-full lg:w-[55%] relative min-h-[60vh] lg:min-h-[100dvh] bg-card lg:border-l border-border flex items-center justify-center overflow-hidden">
        {/* Subtle geometric framing */}
        <div className="absolute inset-8 lg:inset-16 border border-border/30 rounded-[2rem] pointer-events-none z-20" />

        <div className="absolute inset-0 lg:inset-12 z-10 overflow-hidden rounded-[2rem]">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200&h=1200&fit=crop" 
              alt="Arte y Tradición Peruana" 
              className="w-full h-full object-cover transition-transform duration-[4000ms] hover:scale-105"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
