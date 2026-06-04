'use client';

import React from 'react';
import { motion } from 'motion/react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="h-4 w-4" />
            <span>Soporte & Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Términos de Servicio
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Bienvenidos a Andean Vibes. Estos términos rigen el acceso y uso de nuestro portal de comercio y traducción cultural.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="prose prose-neutral dark:prose-invert max-w-none space-y-8"
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">1. Aceptación de los Términos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al navegar en nuestra plataforma, registrar una cuenta, adquirir una suscripción o realizar compras, aceptas expresamente cumplir y estar sujeto a estos Términos de Servicio y a todas las leyes y regulaciones aplicables en el territorio de la República del Perú e internacionales.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">2. Propiedad Intelectual y Artística</h2>
            <p className="text-muted-foreground leading-relaxed">
              Toda la información cultural, traducciones, descripciones de piezas tradicionales, diseños interactivos, imágenes, software y modelos 3D expuestos en **Andean Vibes** son propiedad intelectual protegida de la plataforma o de los maestros artesanos colaboradores. Queda prohibida la reproducción, distribución o uso comercial no autorizado de dichos materiales.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">3. Precios y Transacciones</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todos los precios de las artesanías y membresías están expresados en Soles Peruanos (S/.) e incluyen los impuestos de ley (IGV). Nos reservamos el derecho de modificar los precios sin previo aviso; sin embargo, cualquier transacción confirmada mantendrá el valor originalmente estipulado.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">4. Cuentas de Usuario y Seguridad</h2>
            <p className="text-muted-foreground leading-relaxed">
              Es tu responsabilidad mantener la confidencialidad de tus credenciales de acceso. Cualquier actividad realizada en tu cuenta de usuario es de tu entera responsabilidad. En caso de detectar accesos no autorizados, debes notificar de inmediato a nuestro equipo de soporte.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
