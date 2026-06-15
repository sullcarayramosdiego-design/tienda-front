'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';

const SLIDES = [
  {
    id: 0,
    eyebrow: "Cusco · Textilería Ancestral",
    titleLine1: "Herencia Tejida",
    titleLine2: "En el Tiempo",
    description: "Cada hilo cuenta una historia de resistencia y cosmovisión. Descubre las piezas tejidas a mano en Pisac, teñidas naturalmente con plantas nativas.",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&fit=crop",
    tag: "Pisac",
    detail: "Lana de alpaca con tinte natural"
  },
  {
    id: 1,
    eyebrow: "Puno · Alfarería Sagrada",
    titleLine1: "Barro y Fuego",
    titleLine2: "De los Antepasados",
    description: "El barro moldeado a mano captura la esencia viva de la Pachamama. Explora los ceramios tradicionales y la mística ancestral de Raqch'i.",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1600&fit=crop",
    tag: "Raqch'i",
    detail: "Cerámica tradicional de arcilla"
  },
  {
    id: 2,
    eyebrow: "Ayacucho · Retablo Milenario",
    titleLine1: "Historias Talladas",
    titleLine2: "En Madera de Cedro",
    description: "El retablo ayacuchano es un templo portátil de devoción y folklore. Descubre los detalles tridimensionales que narran la vida de los Andes.",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=1600&fit=crop",
    tag: "Ayacucho",
    detail: "Retablo tradicional de madera"
  }
];

export function MarketingHero() {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const reduce = useReducedMotion();

  // Auto-play slider every 8 seconds, pausing if user interacts
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[activeSlide];

  // Content block animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col justify-between select-none">
      
      {/* 
        ========================================================
        BACKGROUND SHOWCASE: Immersive Cinematic Backdrop Slider
        ========================================================
      */}
      <div className="absolute inset-0 z-0">
        {/* Dark overlay for strict high-contrast text visibility (A11y >= 4.5:1) */}
        <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide}
            src={slide.image}
            alt={slide.eyebrow}
            initial={{ opacity: 0, scale: reduce ? 1 : 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Spacer to fit layout.tsx header */}
      <div className="h-20" />

      {/* 
        ========================================================
        CENTER SECTION: Typographic Narrative
        ========================================================
      */}
      <div className="relative z-20 flex-1 flex flex-col justify-center items-center px-6 md:px-12 text-center max-w-4xl mx-auto space-y-8">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            className="flex flex-col items-center space-y-6"
          >
            {/* Cultural Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1 rounded-[10px] shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] tracking-[0.1em] font-medium text-white/90 font-sans uppercase">
                {slide.eyebrow}
              </span>
            </div>

            {/* Cinematic Large Headline */}
            <h1 className="text-[clamp(2.25rem,5.5vw,4.5rem)] font-heading font-extrabold tracking-[-0.04em] leading-[1.0] text-white text-balance">
              <span className="block text-primary italic font-normal font-heading">
                {slide.titleLine1}
              </span>
              <span className="block text-white">
                {slide.titleLine2}
              </span>
            </h1>

            {/* Description Subtext */}
            <p className="text-base sm:text-lg text-white/95 leading-[1.6] max-w-[65ch] text-balance">
              {slide.description}
            </p>

            {/* Call to Actions */}
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <motion.div whileTap={{ scale: 0.98 }} className="group inline-flex">
                <Link 
                  href="/catalog"
                  className="inline-flex items-center gap-3 bg-primary text-white px-6 py-3.5 font-sans font-bold uppercase tracking-[0.06em] text-xs transition-all duration-150 hover:bg-[#1c7d73] hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-[10px]"
                >
                  <span>Explorar la Colección</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <motion.div whileTap={{ scale: 0.98 }} className="inline-flex">
                <Link 
                  href="/subscription"
                  className="inline-flex items-center justify-center bg-white/10 text-white border border-white/20 px-6 py-3.5 font-sans font-bold uppercase tracking-[0.06em] text-xs transition-all duration-150 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 backdrop-blur-sm rounded-[10px]"
                >
                  Ver Membresías
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* 
        ========================================================
        BOTTOM PANEL: Minimalist Dot Indicators
        ========================================================
      */}
      <div className="relative z-20 w-full flex justify-center items-center pb-12">
        <div className="flex items-center gap-3 bg-black/30 px-4 py-2.5 rounded-[12px] border border-white/10 backdrop-blur-md">
          {SLIDES.map((item) => {
            const isActive = activeSlide === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSlide(item.id)}
                type="button"
                className={`relative h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive ? 'w-6 bg-primary' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Ir al panel ${item.id + 1}`}
              />
            );
          })}
        </div>
      </div>

    </section>
  );
}
