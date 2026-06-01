import { Metadata } from 'next';
import ProductDetailPageClient from './ProductDetailPageClient';
import { productsService } from '@/features/catalog/services/products.service';

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * 1. Generación de Metadatos Dinámicos en Servidor (RSC)
 * Optimizado para motores de búsqueda y redes sociales (Open Graph y Twitter Cards)
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  try {
    // Obtener los datos reales del producto en el servidor
    const product = await productsService.getById(productId);
    
    // Asignar imagen representativa del activo 3D
    // Si posee renders o previsualizaciones asociadas, se priorizan
    const previewImageUrl = product.assets && product.assets.length > 0
      ? `/api/products/${product.id}/preview` // Endpoint simulado de previsualización 3D o render estático
      : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&h=630&fit=crop'; // Un fallback editorial estético

    return {
      title: `${product.name} — Experiencia Modular 3D`,
      description: product.description || 'Ingeniería geométrica superior y lujo suizo. Examina y personaliza el objeto en tiempo real utilizando el visor interactivo 3D.',
      openGraph: {
        title: `${product.name} | Colección Ultra-Lujo`,
        description: product.description || 'Descubre la excelencia geométrica y material de este exclusivo diseño en nuestro visor 3D.',
        type: 'website',
        locale: 'es_PE',
        images: [
          {
            url: previewImageUrl,
            width: 1200,
            height: 630,
            alt: `Modelo 3D de ${product.name}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} — Diseño de Alta Ingeniería 3D`,
        description: product.description || 'Detalles estéticos perfectos, renderizado en tiempo real.',
        images: [previewImageUrl],
      },
    };
  } catch (error) {
    console.error('⚠️ [Metadata Generator] Error fetching product info:', error);
    
    // Fallback robusto y elegante en caso de error de red o compilación estática
    return {
      title: 'Pieza de Diseño Exclusivo 3D | Tienda 3D',
      description: 'Explora muebles y elementos de diseño industrial de alta precisión con simulación y visualización 3D interactiva en tiempo real.',
    };
  }
}

/**
 * 2. Componente de Página Servidor que delega la interactividad
 * de los hooks, modales y renderizadores al cliente sin penalizar el SEO.
 */
export default function ProductDetailPage({ params }: Props) {
  return <ProductDetailPageClient params={params} />;
}
