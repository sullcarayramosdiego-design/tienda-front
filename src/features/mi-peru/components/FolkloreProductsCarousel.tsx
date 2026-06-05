import React from 'react';
import { ProductCard } from '@/features/catalog/components/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  sku?: string;
  images?: string[];
  image?: string;
  has3D?: boolean;
}

interface FolkloreProductsCarouselProps {
  products: Product[];
  cultureName: string;
}

export const FolkloreProductsCarousel: React.FC<FolkloreProductsCarouselProps> = ({ products, cultureName }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="border-t border-slate-800/60 pt-6 mt-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base sm:text-lg font-bold text-cyan-400 font-heading">
          Artesanías y Productos Relacionados
        </h3>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent snap-x">
        {products.map((product) => {
          const mainImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : undefined);
          return (
            <div 
              key={product.id} 
              className="min-w-[200px] sm:min-w-[240px] max-w-[240px] snap-start"
            >
              <ProductCard 
                id={product.id}
                name={product.name}
                price={product.price}
                image={mainImage}
                sku={product.sku}
                slug={product.slug}
                has3D={product.has3D ?? true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
