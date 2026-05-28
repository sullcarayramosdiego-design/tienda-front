'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/features/engagement/hooks/useWishlist';
import { ProductCard } from '@/features/catalog/components';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { items, isLoading } = useWishlist();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <section className="relative overflow-hidden p-6 sm:p-8 border border-primary/10 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent rounded-3xl backdrop-blur-sm">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl opacity-60" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <Badge className="gap-2 text-xs bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-secondary" />
              <span>Lista de Deseos</span>
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight leading-tight">
              Mis{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Favoritos 3D
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              Aquí guardas los productos 3D y de Realidad Aumentada que más te gustan. Revísalos en tres dimensiones, pruébalos en tu espacio o agrégalos directamente al carrito.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      {isLoading ? (
        // Loading skeleton grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-primary/5 bg-card/25 rounded-2xl p-4 space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl bg-primary/5" />
              <Skeleton className="h-4 w-1/3 bg-primary/5" />
              <Skeleton className="h-5 w-3/4 bg-primary/5" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        // Empty State
        <Card className="border border-primary/10 bg-card/40 backdrop-blur-md shadow-lg max-w-md mx-auto py-12 px-6 rounded-3xl overflow-hidden relative">
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-xl" />
          
          <CardContent className="flex flex-col items-center text-center space-y-6 relative z-10">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 animate-bounce" style={{ animationDuration: '3s' }}>
              <Heart className="h-8 w-8 text-primary fill-primary/10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-heading font-bold text-foreground">Tu lista está vacía</h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Aún no has agregado favoritos. ¡Explora nuestro catálogo interactivo para empezar a coleccionar!
              </p>
            </div>
            
            <Button asChild size="lg" className="w-full rounded-2xl bg-primary hover:bg-primary/95 shadow-md shadow-primary/15 font-bold cursor-pointer px-6 active:scale-98">
              <Link href="/catalog" className="flex items-center justify-center gap-2">
                <span>Explorar Catálogo</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Product Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((prod) => (
            <div key={prod.id} className="relative group transition-all duration-300">
              <ProductCard
                id={prod.id}
                name={prod.name}
                price={prod.price}
                image={`/images/products/${prod.sku}.jpg`}
                sku={prod.sku}
                has3D={prod.assets && prod.assets.length > 0}
                slug={prod.slug}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
