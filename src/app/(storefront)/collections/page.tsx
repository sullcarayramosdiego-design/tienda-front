'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Collection {
  id: string;
  title: string;
  origin: string;
  description: string;
  image: string;
  link: string;
}

export default function CollectionsPage() {
  const collections: Collection[] = [
    {
      id: "retablos",
      title: "Retablos Ayacuchanos",
      origin: "Ayacucho, Perú",
      description: "Cajas de madera que encierran mundos. Representaciones tridimensionales y minuciosas que narran la religiosidad, tradiciones agrícolas y la vida cotidiana del pueblo ayacuchano.",
      image: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?q=80&w=600&h=400&fit=crop",
      link: "/catalog?category=retablos"
    },
    {
      id: "mascaras",
      title: "Máscaras de Paucartambo",
      origin: "Cusco, Perú",
      description: "El rostro de la festividad. Utilizadas en las danzas tradicionales en honor a la Virgen del Carmen, combinan yeso, malla fina y colores vivos para personificar personajes históricos y satíricos.",
      image: "https://images.unsplash.com/photo-1590736969955-71cb94801759?q=80&w=600&h=400&fit=crop",
      link: "/catalog?category=mascaras"
    },
    {
      id: "cerámica",
      title: "Cerámica de Chulucanas",
      origin: "Piura, Perú",
      description: "Tierra y humo ancestral. Piezas moldeadas y pulidas a mano que obtienen sus tonos negros y marrones mediante el uso de la técnica de decoración negativa y el ahumado con hojas de mango.",
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&h=400&fit=crop",
      link: "/catalog?category=ceramica"
    },
    {
      id: "textiles",
      title: "Textiles de Taquile",
      origin: "Lago Titicaca, Puno",
      description: "Tejidos que hablan. Una de las tradiciones textiles más refinadas del mundo, declarada Patrimonio Cultural Inmaterial por la UNESCO, donde los tejedores expresan su historia y cosmovisión en cada prenda.",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=600&h=400&fit=crop",
      link: "/catalog?category=textiles"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-[0.2em]">
            <Sparkles className="h-4 w-4" />
            <span>Curaduría Cultural</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Colecciones Especiales
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Explora las corrientes artísticas tradicionales más destacadas del Perú. Cada colección agrupa piezas históricas que puedes visualizar en 3D e integrar en tu espacio.
          </p>
        </motion.div>

        {/* Collections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col, idx) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-card rounded-[2rem] border border-border p-3 overflow-hidden transition-all duration-500 hover:border-primary/20 flex flex-col"
            >
              {/* Image box */}
              <div className="h-64 md:h-80 w-full overflow-hidden rounded-[calc(2rem-0.5rem)] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent z-10" />
                <img 
                  src={col.image} 
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Copy box */}
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-primary font-bold">
                    {col.origin}
                  </span>
                  <h2 className="text-2xl font-black tracking-tight text-foreground">
                    {col.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="pt-4 flex">
                  <Link 
                    href={col.link}
                    className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-colors group/btn"
                  >
                    <span>Ver Piezas de la Colección</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
