'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
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
            <Shield className="h-4 w-4" />
            <span>Soporte & Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Política de Privacidad
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Tu privacidad es de suma importancia para Andean Vibes. Aquí te explicamos cómo recopilamos, usamos y resguardamos tus datos personales.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="prose prose-neutral dark:prose-invert max-w-none space-y-8"
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">1. Información Recopilada</h2>
            <p className="text-muted-foreground leading-relaxed">
              Recopilamos información personal básica (como nombre, correo electrónico, dirección de envío y número telefónico) únicamente cuando te registras en la plataforma, realizas una compra o te suscribes a nuestro boletín informativo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">2. Uso de la Información</h2>
            <p className="text-muted-foreground leading-relaxed">
              Los datos proporcionados se utilizan con los siguientes fines:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Procesar y despachar tus pedidos y compras de manera exitosa.</li>
              <li>Gestionar tu membresía cultural y los accesos exclusivos que correspondan.</li>
              <li>Enviarte actualizaciones del catálogo, historias tradicionales o alertas de seguridad (puedes cancelar la suscripción en cualquier momento).</li>
              <li>Mejorar la usabilidad de nuestra visualización 3D y experiencia web general.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">3. Protección de Datos y Pasarela de Pagos</h2>
            <p className="text-muted-foreground leading-relaxed">
              En cumplimiento con la **Ley N° 29733 (Ley de Protección de Datos Personales de Perú)**, no vendemos ni compartimos tu información con terceros no autorizados. Las transacciones de pago son procesadas de manera segura a través de pasarelas encriptadas con certificación PCI-DSS, por lo que nunca almacenamos los datos de tus tarjetas de crédito en nuestros servidores.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground border-b pb-2">4. Derechos de Acceso y Rectificación</h2>
            <p className="text-muted-foreground leading-relaxed">
              Puedes ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) en cualquier momento escribiéndonos directamente a `privacidad@andeanvibes.com` o actualizando tu información de perfil directamente desde tu cuenta de usuario.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
