'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Truck } from 'lucide-react';

export default function ShippingPolicyPage() {
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
            <Truck className="h-4 w-4" />
            <span>Soporte & Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Políticas de Envío
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            En Andean Vibes nos aseguramos de que cada obra de arte popular peruano llegue en perfectas condiciones a tu hogar, protegiendo su valor histórico y artesanal.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="prose prose-neutral dark:prose-invert max-w-none space-y-8"
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">1. Cobertura y Destinos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Realizamos envíos a nivel nacional (todo el Perú) y envíos internacionales especializados para coleccionistas. Trabajamos con operadores logísticos certificados que garantizan el cuidado de piezas frágiles y tradicionales.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">2. Tiempos de Entrega</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li><strong>Lima Metropolitana:</strong> Entre 2 y 4 días hábiles.</li>
              <li><strong>Provincias (Perú):</strong> Entre 5 y 8 días hábiles dependiendo del destino.</li>
              <li><strong>Envíos Internacionales:</strong> Entre 10 y 15 días hábiles, sujeto a trámites aduaneros y geografía.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">3. Embalaje Especializado</h2>
            <p className="text-muted-foreground leading-relaxed">
              Debido a la naturaleza de nuestras piezas artesanales (cerámicas, retablos y máscaras de madera), cada producto es embalado de manera individual utilizando amortiguación ecológica de alta densidad y cajas reforzadas para evitar cualquier tipo de daño en el trayecto.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">4. Retiro en Casa Cultural</h2>
            <p className="text-muted-foreground leading-relaxed">
              También puedes retirar tu pedido directamente en nuestra **Casa Cultural Andean Vibes en San Isidro, Lima, Perú**, seleccionando esta opción al momento de realizar el pago. Estará listo para retiro en 24 horas hábiles.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
