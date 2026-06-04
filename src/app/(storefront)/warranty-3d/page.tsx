'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

export default function Warranty3DPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-3xl mx-auto space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-[0.2em]">
            <ShieldCheck className="h-4 w-4" />
            <span>Soporte & Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Garantía de Fidelidad 3D
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Nuestra exclusiva Garantía 3D certifica que la pieza física que llega a tus manos es una representación exacta del modelo tridimensional interactivo con el que interactuaste en la plataforma.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="prose prose-neutral dark:prose-invert max-w-none space-y-8"
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">1. ¿En qué consiste la Garantía 3D?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sabemos que comprar arte popular tradicional a distancia requiere confianza. Por ello, empleamos escaneo fotogramétrico de ultra-alta definición para recrear cada relieve, trazo de pintura y textura en nuestros modelos 3D y de realidad aumentada (AR). Garantizamos que el producto físico recibido coincide en proporciones, colores y detalles artísticos con el modelo digital.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">2. Autenticidad Artesanal</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dado que cada retablo, ceramio o textil peruano es elaborado y pintado 100% a mano por maestros artesanos, pueden existir mínimas variaciones inherentes a la manufactura artesanal (como matices leves en pinceladas individuales). Sin embargo, garantizamos la correspondencia estética general de la obra.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">3. Discrepancias y Devolución Directa</h2>
            <p className="text-muted-foreground leading-relaxed">
              Si consideras que la pieza física recibida posee una discrepancia estructural significativa respecto al modelo 3D digital interactivo que visualizaste al comprar, cubrimos los costos de retorno y realizamos el cambio de pieza o devolución total de tu dinero de manera prioritaria.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">4. Soporte Técnico</h2>
            <p className="text-muted-foreground leading-relaxed">
              Si experimentas problemas al visualizar los modelos interactivos en 3D o proyectar las piezas en realidad aumentada desde tu dispositivo móvil, nuestro canal de soporte técnico está disponible para ayudarte a configurar tu navegador.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
