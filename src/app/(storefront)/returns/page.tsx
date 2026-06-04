'use client';

import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';

export default function ReturnsPage() {
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
            <RotateCcw className="h-4 w-4" />
            <span>Soporte & Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Cambios y Devoluciones
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Tu satisfacción y tranquilidad al adquirir arte popular peruano son nuestra prioridad. Aquí te detallamos cómo gestionar cualquier cambio o reembolso.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="prose prose-neutral dark:prose-invert max-w-none space-y-8"
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">1. Plazo de Solicitud</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dispones de un plazo máximo de **30 días calendario**, a partir de la fecha de entrega del producto, para solicitar un cambio de pieza o la devolución total de tu dinero.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">2. Condiciones de las Piezas</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al tratarse de artesanías delicadas y obras de arte popular, para que una devolución o cambio sea aceptado, el producto debe cumplir con los siguientes requisitos:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>No presentar signos de daño, alteración, caídas o manipulación negligente posterior a la entrega.</li>
              <li>Conservar el empaque original protector y certificados de autenticidad adjuntos (si corresponde).</li>
              <li>Presentar el comprobante de pago digital o número de pedido.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">3. Proceso para Solicitar un Cambio o Devolución</h2>
            <ol className="list-decimal pl-5 text-muted-foreground space-y-3">
              <li><strong>Envía un correo:</strong> Escribe a `soporte@andeanvibes.com` o contáctanos por WhatsApp adjuntando fotos de la pieza y tu número de orden.</li>
              <li><strong>Inspección y Aprobación:</strong> Nuestro equipo revisará la solicitud y te proporcionará una etiqueta de envío de retorno sin costo en caso de que aplique por Garantía 3D o daño de transporte.</li>
              <li><strong>Devolución del Importe:</strong> Una vez recibido e inspeccionado el producto en nuestros talleres, procesaremos el reembolso a tu tarjeta de crédito/débito o cuenta bancaria en un plazo de 3 a 5 días hábiles.</li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">4. Daños durante el Transporte</h2>
            <p className="text-muted-foreground leading-relaxed">
              Si tu paquete llega visiblemente golpeado o la pieza llega dañada por el transportista, repórtalo de inmediato (dentro de las primeras 48 horas de recibido) para activar el seguro de envío y enviarte una pieza de reemplazo a la brevedad.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
