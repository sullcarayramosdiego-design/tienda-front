'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProduct } from '@/features/inventory';
import { useAuth } from '@/features/auth';
import { useCart } from '@/features/checkout';
import { useWishlist } from '@/features/engagement';
import dynamic from 'next/dynamic';

const ProductViewer3D = dynamic(
  () => import('@/features/catalog').then((mod) => mod.ProductViewer3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-muted/20 border border-primary/5 rounded-3xl gap-3">
        <div className="relative">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          <div className="absolute inset-0 h-8 w-8 bg-primary/20 blur-xl rounded-full" />
        </div>
        <span className="text-xs text-muted-foreground font-semibold">Cargando visualizador 3D...</span>
      </div>
    ),
  }
);
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductReviews } from '@/features/engagement';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus, 
  Lock,
  Wallet,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const { product, loading, error } = useProduct(productId);
  const { isAuthenticated } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [addedNotify, setAddedNotify] = useState(false);
  const [favNotify, setFavNotify] = useState(false);

  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const isFavorite = product ? hasItem(product.id) : false;

  // Format price in local Peruvian Soles (S/)
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value);
  };

  const displayedPrice = selectedVariant ? selectedVariant.price : (product?.price ?? 0);
  const displayedStock = selectedVariant ? selectedVariant.stock : (product?.stock ?? 0);
  const displayedSku = selectedVariant ? selectedVariant.sku : (product?.sku ?? '');
  const displayedName = selectedVariant ? `${product?.name ?? ''} (${selectedVariant.name})` : (product?.name ?? '');

  const handleAddToCart = () => {
    if (!product) return;
    const cartProduct = selectedVariant
      ? {
          ...product,
          id: `${product.id}-${selectedVariant.id}`,
          name: `${product.name} (${selectedVariant.name})`,
          price: selectedVariant.price,
          sku: selectedVariant.sku,
          stock: selectedVariant.stock,
        }
      : product;
    addItem(cartProduct, quantity);
    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 3000);
  };

  const handleToggleFav = () => {
    if (!product) return;
    const favProduct = selectedVariant
      ? {
          ...product,
          id: `${product.id}-${selectedVariant.id}`,
          name: `${product.name} (${selectedVariant.name})`,
          price: selectedVariant.price,
          sku: selectedVariant.sku,
          stock: selectedVariant.stock,
        }
      : product;
    toggleItem(favProduct);
    setFavNotify(true);
    setTimeout(() => setFavNotify(false), 3000);
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl space-y-8 animate-pulse">
        <Skeleton className="h-6 w-48 bg-primary/5 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <div className="aspect-square w-full bg-primary/5 rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-24 bg-primary/5" />
            <Skeleton className="h-10 w-3/4 bg-primary/5" />
            <Skeleton className="h-8 w-1/3 bg-primary/5" />
            <Skeleton className="h-20 w-full bg-primary/5" />
            <Skeleton className="h-12 w-full bg-primary/5" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg space-y-6">
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 rounded-2xl">
          <AlertDescription className="font-semibold">
            {error || 'El producto seleccionado no existe o no pudo ser cargado.'}
          </AlertDescription>
        </Alert>
        <Button asChild className="bg-primary text-primary-foreground font-bold cursor-pointer rounded-xl">
          <Link href="/catalog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Regresar al Catálogo
          </Link>
        </Button>
      </div>
    );
  }

  // Check if product has custom GLB assets
  const glbAssetUrl = product.assets && product.assets.length > 0
    ? product.assets[0].fileUrl
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 pb-20">
      
      {/* Navigation breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 max-w-7xl">
        <Link 
          href="/catalog" 
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al catálogo
        </Link>
      </div>

      {/* Main Grid Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* ================================================= */}
          {/* LEFT SIDE - 3D Viewer (occupies half width)        */}
          {/* ================================================= */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="relative w-full aspect-square bg-card border border-primary/10 rounded-3xl overflow-hidden shadow-xl">
              <ProductViewer3D 
                modelUrl={glbAssetUrl}
                className="w-full h-full"
              />
            </div>

            {/* Gesture Tip panel */}
            <div className="flex items-center gap-2.5 p-4 border border-primary/10 bg-card/60 backdrop-blur-md rounded-2xl justify-center">
              <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse shrink-0" />
              <span className="text-xs text-muted-foreground font-semibold text-center">Interactúa con el modelo arrastrando y haciendo zoom.</span>
            </div>
          </div>

          {/* ================================================= */}
          {/* RIGHT SIDE - Product Details (occupies half width) */}
          {/* ================================================= */}
          <div className="space-y-6">
            
            {/* Tag & Stock Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border",
                  displayedStock > 0
                    ? "bg-[#00D47C]/10 border-[#00D47C]/20 text-[#00AF66]"
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                )}>
                  {displayedStock > 0 ? 'Stock Disponible' : 'Agotado'}
                </span>
                <span className="text-xs font-bold text-muted-foreground font-mono">
                  SKU: {displayedSku}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground leading-tight">
                {displayedName}
              </h1>

              {/* Price */}
              <div className="text-3xl font-heading font-black text-primary">
                {formatPrice(displayedPrice)}
              </div>
            </div>

            <hr className="border-primary/5" />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-muted-foreground">
                Descripción
              </h3>
              <p className="text-sm sm:text-base text-foreground leading-relaxed">
                {product.description || 'Este producto cuenta con una increíble experiencia de visualización tridimensional optimizada en WebGL. Ideal para examinar acabados y geometrías exactas.'}
              </p>
            </div>

            {/* Product Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <>
                <hr className="border-primary/5" />
                <div className="space-y-4">
                  <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-muted-foreground">
                    Variantes Disponibles
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.variants.map((v: any) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSelectedVariant(isSelected ? null : v);
                            if (v.stock < quantity) {
                              setQuantity(Math.max(1, v.stock));
                            }
                          }}
                          className={cn(
                            "flex flex-col text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                            isSelected
                              ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                              : "border-primary/10 bg-card/40 hover:bg-card/80 hover:border-primary/20"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-bl-lg flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-background rounded-full" />
                            </div>
                          )}
                          <span className="text-xs font-bold text-foreground line-clamp-1">{v.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">SKU: {v.sku}</span>
                          <div className="flex justify-between items-center mt-2 w-full">
                            <span className="text-xs font-black text-primary">{formatPrice(v.price)}</span>
                            <span className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded",
                              v.stock > 0 ? "bg-[#00D47C]/10 text-[#00AF66]" : "bg-destructive/10 text-destructive"
                            )}>
                              {v.stock > 0 ? `${v.stock} disp.` : 'Agotado'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <hr className="border-primary/5" />

            {/* ================================================= */}
            {/* SESSION-GATED ACTION AREA                         */}
            {/* ================================================= */}
            {isAuthenticated ? (
              <div className="space-y-4">
                
                {/* Quantity selector */}
                <div className="flex items-center justify-between p-3.5 border border-primary/10 bg-card/60 backdrop-blur-md rounded-2xl">
                  <span className="text-sm font-bold text-muted-foreground">Cantidad</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-8 w-8 rounded-lg border-primary/10 cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(displayedStock, quantity + 1))}
                      disabled={quantity >= displayedStock}
                      className="h-8 w-8 rounded-lg border-primary/10 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Main purchase buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 text-sm font-bold tracking-wider bg-primary hover:bg-primary/95 text-primary-foreground rounded-2xl shadow-lg shadow-primary/15 cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Añadir al Carrito
                  </Button>
                  
                  <Button
                    variant={isFavorite ? "default" : "outline"}
                    onClick={handleToggleFav}
                    className={cn(
                      "h-12 w-12 rounded-2xl border-primary/10 hover:bg-primary/5 hover:text-primary cursor-pointer active:scale-95 transition-all flex items-center justify-center shrink-0",
                      isFavorite && "bg-gradient-to-r from-primary to-secondary text-primary-foreground border-transparent shadow-md shadow-primary/15"
                    )}
                    aria-label="Añadir a favoritos"
                  >
                    <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                  </Button>
                </div>

                {/* Action Success Notifications */}
                {addedNotify && (
                  <div className="flex items-center gap-2 p-3 bg-[#00D47C]/10 border border-[#00D47C]/20 text-[#00AF66] rounded-xl text-xs font-semibold animate-fade-in">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    <span>¡Producto añadido al carrito! ({quantity} unidades)</span>
                  </div>
                )}

                {favNotify && (
                  <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-semibold animate-fade-in">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    <span>¡Producto guardado en tus favoritos!</span>
                  </div>
                )}
              </div>
            ) : (
              // Glassmorphism login prompt banner
              <div className="relative overflow-hidden p-6 border border-primary/15 bg-primary/5 rounded-3xl backdrop-blur-sm space-y-4">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-xl" />
                
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">Comienza tu compra</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Inicia sesión para añadir este producto a tu carrito, guardarlo en favoritos y explorar métodos de pago locales.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button asChild size="sm" className="flex-1 h-9 font-bold bg-primary hover:bg-primary/95 text-xs rounded-xl cursor-pointer shadow-md shadow-primary/10">
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1 h-9 font-bold border-primary/15 hover:bg-primary/5 text-xs rounded-xl cursor-pointer">
                    <Link href="/register">Registrarse</Link>
                  </Button>
                </div>
              </div>
            )}



          </div>

        </div>

        {/* ================================================= */}
        {/* PRODUCT REVIEWS COMPONENT (Full width at bottom)  */}
        {/* ================================================= */}
        <div className="mt-2">
          <ProductReviews productId={product.id} />
        </div>
      </main>
    </div>
  );
}
