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

  if (productId === 'default') {
    return {
      title: 'Arte Popular Peruano & Tradición | Andean Vibes',
      description: 'Explora ceramios, retablos y máscaras tradicionales de la cultura popular peruana con traducción cultural e interactividad 3D y AR.',
    };
  }

  try {
    // Obtener los datos reales del producto en el servidor
    const product = await productsService.getById(productId);
    
    // Asignar imagen representativa del activo 3D
    // Si posee renders o previsualizaciones asociadas, se priorizan
    const previewImageUrl = product.assets && product.assets.length > 0
      ? `/api/products/${product.id}/preview` // Endpoint simulado de previsualización 3D o render estático
      : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&h=630&fit=crop'; // Un fallback editorial estético

    return {
      title: `${product.name} — Tradición & Cultura Andina`,
      description: product.description || 'Explora el simbolismo y la historia de esta pieza de arte popular peruano. Interactúa con el objeto en 3D para apreciar el relieve de su fabricación.',
      openGraph: {
        title: `${product.name} | Colección Tradicional Peruana`,
        description: product.description || 'Descubre la cosmovisión y el significado material de esta pieza de arte popular en nuestro visor 3D.',
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
        title: `${product.name} — Arte Popular & Cosmovisión Peruana`,
        description: product.description || 'Conoce la historia y el significado de esta pieza artesanal en 3D.',
        images: [previewImageUrl],
      },
    };
  } catch (error) {
    console.error('⚠️ [Metadata Generator] Error fetching product info:', error);
    
    // Fallback robusto y elegante en caso de error de red o compilación estática
    return {
      title: 'Arte Popular Peruano & Tradición | Andean Vibes',
      description: 'Explora ceramios, retablos y máscaras tradicionales de la cultura popular peruana con traducción cultural e interactividad 3D y AR.',
    };
  }
}

import { connection } from 'next/server';

export async function generateStaticParams() {
  return [{ id: 'default' }]; // Next.js 16 requiere al menos un elemento para validar tipos en compilación con cacheComponents
}

/**
 * 2. Componente de Página Servidor que delega la interactividad
 * de los hooks, modales y renderizadores al cliente sin penalizar el SEO.
 */
export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  if (id === 'default') {
    return <div className="min-h-screen bg-background" />;
  }
  await connection(); // Hace que la página sea renderizada dinámicamente en tiempo de solicitud
  return <ProductDetailPageClient params={params} />;
}
