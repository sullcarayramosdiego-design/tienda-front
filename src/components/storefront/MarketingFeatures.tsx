import { Card } from '@/components/ui/card';
import { Box, Eye, Smartphone, Sparkles, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Box,
    title: 'Visualización 3D',
    description:
      'Explora cada detalle de nuestros productos con modelos 3D interactivos de alta calidad.',
  },
  {
    icon: Smartphone,
    title: 'Realidad Aumentada',
    description:
      'Prueba cómo se ve en tu espacio antes de comprar con tecnología AR.',
  },
  {
    icon: Eye,
    title: 'Vista 360°',
    description:
      'Rota, acerca y examina productos desde cualquier ángulo en tiempo real.',
  },
  {
    icon: Zap,
    title: 'Carga Instantánea',
    description:
      'Modelos optimizados que cargan en segundos sin sacrificar calidad.',
  },
  {
    icon: Sparkles,
    title: 'Calidad Premium',
    description:
      'Texturas fotorrealistas y renderizado de última generación.',
  },
  {
    icon: Shield,
    title: 'Compra Segura',
    description:
      'Protección de compra y garantía de satisfacción en todos tus pedidos.',
  },
];

export function MarketingFeatures() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4">¿Por qué elegirnos?</h2>
          <p className="lead">
            Revolucionamos el e-commerce combinando tecnología 3D de vanguardia
            con una experiencia de usuario excepcional.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="p-6 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Icon className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
