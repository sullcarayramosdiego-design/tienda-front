'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "¿Qué es Andean Vibes?",
      answer: "Andean Vibes es un e-commerce y portal de divulgación cultural que promueve y vende arte popular tradicional del Perú. Nuestro propósito es conectar a maestros artesanos locales con el mundo, permitiendo explorar la cosmovisión e historia de cada obra a través de traducción cultural y visualización interactiva en 3D."
    },
    {
      question: "¿Cómo funcionan las visualizaciones 3D y la realidad aumentada (AR)?",
      answer: "Cada obra de arte en nuestro catálogo ha sido escaneada con fotogrametría digital. En su ficha de producto, puedes arrastrar y rotar la pieza en 3D para apreciar sus detalles. Si accedes desde un teléfono móvil compatible, puedes pulsar el botón 'Ver en Realidad Aumentada' para proyectar la pieza a escala real sobre cualquier superficie física de tu entorno."
    },
    {
      question: "¿Las piezas son auténticas y hechas a mano?",
      answer: "Sí, absolutamente. Todas las piezas vendidas en Andean Vibes son obras de arte auténticas elaboradas a mano por maestros artesanos del Perú en sus respectivos talleres tradicionales. Al no ser productos industriales, cada pieza posee rasgos únicos y sutiles variaciones en trazos y colores que garantizan su originalidad."
    },
    {
      question: "¿Cómo funciona la política de Comercio Justo?",
      answer: "Trabajamos directamente con los artesanos sin intermediarios especulativos. El precio de cada pieza garantiza una compensación digna para el taller creador. Además, nuestras Membresías Culturales y compras aportan recursos directos para financiar la preservación de talleres tradicionales y la enseñanza de estas artes a nuevas generaciones."
    },
    {
      question: "¿Cómo se embalan y envían las obras de arte frágiles?",
      answer: "Sabemos que las cerámicas, retablos y máscaras son delicadas. Cada producto se envuelve de forma elástica en materiales protectores ecológicos y se coloca en cajas rígidas acolchadas contra impactos severos. Contamos con un seguro integral de envío para reposición o devolución inmediata en caso de incidentes de transporte."
    },
    {
      question: "¿Hacen envíos internacionales?",
      answer: "Sí. Realizamos despachos especializados para coleccionistas e interesados en todo el mundo, cumpliendo con los protocolos de exportación de patrimonio cultural contemporáneo y colaborando con empresas de logística internacional certificadas."
    }
  ];

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
            <HelpCircle className="h-4 w-4" />
            <span>Soporte & Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Preguntas Frecuentes
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Resuelve tus dudas sobre el funcionamiento de la plataforma, el soporte tecnológico 3D y nuestro compromiso con el arte popular peruano.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="border border-border/60 bg-card/35 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/20"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left font-bold text-base md:text-lg select-none cursor-pointer focus:outline-none"
                >
                  <span className="text-foreground">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="pb-6 px-6 text-sm md:text-base text-muted-foreground leading-relaxed border-t border-border/10 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
