'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard, CategoryFilter, PriceRangeSlider } from '@/components/storefront';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Trash2,
  PackageOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductListIntegrated() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 1. Read filter values from URL parameters as Source of Truth
  const pageParam = searchParams.get('page');
  const categoryParam = searchParams.get('category');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const only3DParam = searchParams.get('only3D');
  const searchParam = searchParams.get('search');

  // Convert URL parameters to correct JavaScript types
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const selectedCategory = categoryParam || null;
  const priceRange = useMemo(() => ({
    min: minPriceParam ? parseFloat(minPriceParam) : undefined,
    max: maxPriceParam ? parseFloat(maxPriceParam) : undefined,
  }), [minPriceParam, maxPriceParam]);
  const only3D = only3DParam === 'true';
  const activeSearch = searchParam || '';

  // Local state only for the raw search input text box (so user can type before submitting)
  const [searchVal, setSearchVal] = useState(activeSearch);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync raw input searchVal if activeSearch changes externally (e.g. clear filters)
  useEffect(() => {
    setSearchVal(activeSearch);
  }, [activeSearch]);

  // Helper to push updated search parameters to the URL
  const updateQueryParams = (newParams: Record<string, string | number | boolean | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === false) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    
    // Reset page to 1 when changing any filter (unless we are explicitly paginating)
    if (!('page' in newParams)) {
      params.delete('page');
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // 2. Memoized parameters for backend hook
  const queryParams = useMemo(() => {
    return {
      page,
      limit: 12,
      search: activeSearch || undefined,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      category: selectedCategory || undefined,
      only3D: only3D || undefined,
    };
  }, [page, activeSearch, priceRange.min, priceRange.max, selectedCategory, only3D]);

  // 3. Fetch products from the backend hook
  const { products, loading, error, meta } = useProducts(queryParams);

  const handleCategoryChange = (cat: string | null) => {
    updateQueryParams({ category: cat });
  };

  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    updateQueryParams({ minPrice: min, maxPrice: max });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ search: searchVal });
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage });
  };

  const clearAllFilters = () => {
    setSearchVal('');
    router.push(pathname, { scroll: false });
  };

  // 4. Rely entirely on clean backend filtered & paginated data
  const filteredProducts = useMemo(() => {
    return Array.isArray(products) ? products : [];
  }, [products]);

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeSearch) count++;
    if (selectedCategory) count++;
    if (priceRange.min !== undefined || priceRange.max !== undefined) count++;
    if (only3D) count++;
    return count;
  }, [activeSearch, selectedCategory, priceRange.min, priceRange.max, only3D]);

  return (
    <div className="flex flex-col lg:flex-row-reverse gap-8 items-start">
      
      {/* ========================================== */}
      {/* DESKTOP SIDEBAR - Filters                  */}
      {/* ========================================== */}
      <aside className="hidden lg:flex flex-col gap-6 w-[292px] shrink-0 sticky top-20 max-h-[calc(100vh-110px)] overflow-y-auto px-3 pb-6 select-none scrollbar-thin">
        {/* Toggle 3D Products */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-primary/15 bg-primary/5 shadow-sm">
          <div className="space-y-0.5">
            <span className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-secondary" />
              Experiencia 3D
            </span>
            <p className="text-[11px] text-muted-foreground">Sólo modelos interactivos</p>
          </div>
          <button
            onClick={() => updateQueryParams({ only3D: !only3D })}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none",
              only3D ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-300 ease-in-out",
                only3D ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>

        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange} 
        />
        
        <PriceRangeSlider 
          minPrice={priceRange.min} 
          maxPrice={priceRange.max} 
          onPriceChange={handlePriceChange} 
        />

        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="w-full gap-2 border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive cursor-pointer rounded-xl font-bold uppercase tracking-wider text-xs h-10"
          >
            <Trash2 className="h-4 w-4" />
            Limpiar Filtros
          </Button>
        )}
      </aside>

      {/* ========================================== */}
      {/* MAIN CONTAINER - Search & Grid             */}
      {/* ========================================== */}
      <div className="flex-1 w-full space-y-6">
        
        {/* Search Header Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full flex-1">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por producto, marca o SKU..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="pl-10 pr-20 h-11 border-primary/10 bg-card/40 backdrop-blur-sm focus-visible:ring-primary/30 rounded-xl"
            />
            {searchVal && (
              <button
                type="button"
                onClick={() => { setSearchVal(''); updateQueryParams({ search: null }); }}
                className="absolute right-16 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-2 h-7 px-3 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/95 transition-all cursor-pointer"
            >
              Buscar
            </button>
          </form>

          {/* Mobile Filter Button */}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(true)}
              className="flex lg:hidden items-center justify-center gap-2 w-full sm:w-auto h-11 border-primary/10 bg-card/40 rounded-xl cursor-pointer"
            >
              <SlidersHorizontal className="h-4.5 w-4.5 text-primary" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Active Filter Tags (Pills) */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
              Filtros Activos:
            </span>
            {activeSearch && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-full">
                Búsqueda: "{activeSearch}"
                <X className="h-3 w-3 cursor-pointer hover:text-foreground" onClick={() => updateQueryParams({ search: null })} />
              </span>
            )}
            {selectedCategory && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-full">
                Categoría: {selectedCategory}
                <X className="h-3 w-3 cursor-pointer hover:text-foreground" onClick={() => updateQueryParams({ category: null })} />
              </span>
            )}
            {(priceRange.min !== undefined || priceRange.max !== undefined) && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-full">
                Precio: S/ {priceRange.min ?? 0} - S/ {priceRange.max ?? 'Max'}
                <X className="h-3 w-3 cursor-pointer hover:text-foreground" onClick={() => updateQueryParams({ minPrice: null, maxPrice: null })} />
              </span>
            )}
            {only3D && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-full">
                Sólo 3D / AR
                <X className="h-3 w-3 cursor-pointer hover:text-foreground" onClick={() => updateQueryParams({ only3D: null })} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-destructive hover:underline ml-1 cursor-pointer"
            >
              Borrar todo
            </button>
          </div>
        )}

        {/* ========================================== */}
        {/* PRODUCTS GRID / SKELETON LOADERS           */}
        {/* ========================================== */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-primary/5 bg-card/25 rounded-2xl p-5 space-y-4">
                <Skeleton className="aspect-square w-full rounded-xl bg-primary/5" />
                <Skeleton className="h-4.5 w-1/3 bg-primary/5" />
                <Skeleton className="h-6 w-3/4 bg-primary/5" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-24 bg-primary/5" />
                  <Skeleton className="h-5 w-16 bg-primary/5" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 rounded-2xl">
            <AlertDescription className="font-semibold text-sm">
              Error al conectar con la tienda: {error}
            </AlertDescription>
          </Alert>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-card/20 border border-primary/5 rounded-3xl backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary">
              <PackageOpen className="h-8 w-8" />
            </div>
            <div className="space-y-1.5 max-w-sm px-6">
              <h3 className="font-heading font-bold text-lg text-foreground">No encontramos productos</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prueba cambiando los términos de búsqueda o eliminando los filtros activos actuales.
              </p>
            </div>
            {activeFiltersCount > 0 && (
              <Button onClick={clearAllFilters} size="sm" className="bg-primary text-primary-foreground font-bold cursor-pointer">
                Ver todos los productos
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Real Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={`/images/products/${product.sku}.jpg`}
                  sku={product.sku}
                  has3D={product.assets && product.assets.length > 0}
                  slug={product.slug}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-primary/5">
                <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
                  Mostrando <span className="text-foreground font-bold">{filteredProducts.length}</span> de <span className="text-foreground font-bold">{meta.total}</span> productos
                </p>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="h-9 w-9 p-0 border-primary/10 rounded-xl cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex gap-1.5">
                    {Array.from({ length: meta.totalPages }, (_, i) => (
                      <Button
                        key={i}
                        variant={page === i + 1 ? 'default' : 'outline'}
                        onClick={() => handlePageChange(i + 1)}
                        className={cn(
                          "h-9 min-w-9 px-3 text-xs font-bold rounded-xl cursor-pointer transition-all duration-300",
                          page === i + 1 
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                            : "border-primary/10 hover:bg-primary/5 hover:text-primary"
                        )}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === meta.totalPages}
                    className="h-9 w-9 p-0 border-primary/10 rounded-xl cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MOBILE DRAWER FILTERS                      */}
      {/* ========================================== */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowMobileFilters(false)}
          />
          {/* Panel */}
          <div className="relative w-full max-w-sm h-full bg-background border-l border-primary/10 flex flex-col p-6 overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between pb-4 border-b border-primary/5 mb-6">
              <span className="text-base font-heading font-extrabold text-foreground uppercase tracking-wider">
                Filtros
              </span>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="p-1 rounded-lg border border-primary/10 hover:bg-muted cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              {/* Only 3D Products Switch */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-primary/15 bg-primary/5">
                <div className="space-y-0.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse text-secondary" />
                    Experiencia 3D
                  </span>
                  <p className="text-[10px] text-muted-foreground">Sólo modelos interactivos</p>
                </div>
                <button
                  onClick={() => updateQueryParams({ only3D: !only3D })}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none",
                    only3D ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-300 ease-in-out",
                      only3D ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              <CategoryFilter 
                selectedCategory={selectedCategory} 
                onCategoryChange={(cat) => { handleCategoryChange(cat); setShowMobileFilters(false); }} 
              />
              
              <PriceRangeSlider 
                minPrice={priceRange.min} 
                maxPrice={priceRange.max} 
                onPriceChange={(min, max) => { handlePriceChange(min, max); setShowMobileFilters(false); }} 
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-primary/5 mt-6 space-y-3">
              <Button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-primary text-primary-foreground font-bold h-10 rounded-xl cursor-pointer"
              >
                Aplicar Filtros
              </Button>
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  onClick={() => { clearAllFilters(); setShowMobileFilters(false); }}
                  className="w-full gap-2 border-destructive/20 text-destructive hover:bg-destructive/5 cursor-pointer h-10 rounded-xl font-bold uppercase tracking-wider text-xs"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpiar Todo
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductListIntegrated;

