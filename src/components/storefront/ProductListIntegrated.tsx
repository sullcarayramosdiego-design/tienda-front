'use client';

import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

/**
 * Componente integrado con el backend para mostrar productos
 * Utiliza el hook useProducts que maneja la llamada a la API
 */
export function ProductListIntegrated() {
  const { products, loading, error, meta, goToPage } = useProducts({
    page: 1,
    limit: 12,
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error al cargar productos: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={`/images/products/${product.sku}.jpg`} // Placeholder
            stock={product.stock}
            rating={4.5} // Placeholder hasta que tengamos ratings en el backend
          />
        ))}
      </div>

      {/* Paginación */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => goToPage(meta.page - 1)}
            disabled={meta.page === 1}
          >
            Anterior
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: meta.totalPages }, (_, i) => (
              <Button
                key={i}
                variant={meta.page === i + 1 ? 'default' : 'outline'}
                onClick={() => goToPage(i + 1)}
                size="sm"
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => goToPage(meta.page + 1)}
            disabled={meta.page === meta.totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Información de paginación */}
      {meta && (
        <p className="text-center text-sm text-muted-foreground">
          Mostrando {products.length} de {meta.total} productos
        </p>
      )}
    </div>
  );
}

export default ProductListIntegrated;
