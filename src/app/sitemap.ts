import { MetadataRoute } from 'next';
import { productsService } from '@/features/catalog/services/products.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 1. Rutas estáticas principales
  const routes = [
    '',
    '/catalog',
    '/wishlist',
    '/referrals',
    '/loyalty',
    '/subscription',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Mapeo dinámico de categorías desde la base de datos
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await productsService.getCategories();
    if (categories && Array.isArray(categories)) {
      categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/catalog?category=${cat.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('⚠️ [Sitemap Builder] Error al obtener categorías:', error);
  }

  // 3. Mapeo dinámico de productos desde la base de datos
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const productData = await productsService.list({ limit: 100 });
    if (productData && productData.items && Array.isArray(productData.items)) {
      productRoutes = productData.items.map((prod) => ({
        url: `${baseUrl}/products/${prod.id}`,
        lastModified: prod.updatedAt ? new Date(prod.updatedAt) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      }));
    }
  } catch (error) {
    console.error('⚠️ [Sitemap Builder] Error al obtener productos:', error);
  }

  return [...routes, ...categoryRoutes, ...productRoutes];
}
