'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProduct } from '@/features/inventory';
import { useAuth } from '@/features/auth';
import { useCart } from '@/features/checkout';
import { useWishlist } from '@/features/engagement';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';

const ProductViewer3D = dynamic(
  () => import('@/features/catalog').then((mod) => mod.ProductViewer3D),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-full bg-muted/10 flex flex-col items-center justify-center overflow-hidden">
        <Skeleton className="absolute inset-0 bg-gradient-to-r from-muted/5 via-muted/10 to-muted/5 animate-pulse rounded-none" />
        <div className="absolute inset-8 lg:inset-16 border border-border/20 rounded-[2rem] pointer-events-none flex flex-col items-center justify-center">
          <div className="space-y-4 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground/30 font-mono animate-pulse">
              [ INICIALIZANDO ENTORNO 3D ]
            </span>
            <div className="w-24 h-[1px] bg-border/20 mx-auto" />
            <span className="text-[9px] uppercase tracking-[0.1em] font-medium text-foreground/20 font-mono block animate-pulse">
              Tolerancia Geométrica Superior
            </span>
          </div>
        </div>
      </div>
    ),
  }
);
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductReviews } from '@/features/engagement';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  CheckCircle2,
  Lock,
  Minus,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductDetailPageClient({
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const isFavorite = product ? hasItem(product.id) : false;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const displayedPrice = selectedVariant ? selectedVariant.price : (product?.price ?? 0);
  const displayedStock = selectedVariant ? selectedVariant.stock : (product?.stock ?? 0);
  const displayedSku = selectedVariant ? selectedVariant.sku : (product?.sku ?? '');
  const displayedName = selectedVariant ? `${product?.name ?? ''} — ${selectedVariant.name}` : (product?.name ?? '');

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

  if (loading) {
    return (
      <div className="w-full h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-12 w-64 bg-muted" />
        <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground animate-pulse">Obteniendo datos...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full h-screen bg-background flex flex-col items-center justify-center space-y-8">
        <h1 className="text-4xl font-black tracking-tighter text-foreground">Sistema No Disponible</h1>
        <Button asChild variant="ghost" className="uppercase tracking-[0.2em] font-bold text-xs rounded-none border-b border-foreground pb-1 hover:bg-transparent">
          <Link href="/catalog">
            Regresar al Índice
          </Link>
        </Button>
      </div>
    );
  }

  const glbAssetUrl = product.assets && product.assets.length > 0
    ? product.assets[0].fileUrl
    : undefined;

  const productImages: string[] = selectedVariant?.images && selectedVariant.images.length > 0
    ? selectedVariant.images
    : product.images && product.images.length > 0
    ? product.images
    : [`/images/products/${product.sku}.jpg`];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background flex flex-col lg:flex-row overflow-x-hidden">
      
      {/* 
        ========================================================
        LEFT COLUMN: FULL BLEED 3D CANVAS
        ========================================================
      */}
      <div className="w-full lg:w-[55%] relative h-[60vh] lg:h-[100dvh] lg:sticky top-0 bg-muted/20 overflow-hidden group">
        
        {/* Navigation overlaid on the 3D canvas */}
        <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
          <Link 
            href="/catalog" 
            className="inline-flex items-center gap-3 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.2em]"
          >
            <ArrowLeft className="h-4 w-4" /> Índice Global
          </Link>
        </div>

        {!glbAssetUrl ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/5 via-muted/30 to-secondary/5">
            <motion.img
              key={activeImageIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              src={productImages[activeImageIndex]}
              alt={product.name}
              className="max-w-full max-h-[80%] object-contain rounded-2xl shadow-2xl border border-primary/5"
            />
            {/* Gallery Navigation Dot Indicators */}
            {productImages.length > 1 && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full border transition-all duration-300 cursor-pointer",
                      activeImageIndex === idx 
                        ? "bg-foreground border-foreground w-6" 
                        : "bg-foreground/20 border-transparent hover:bg-foreground/45"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-10"
          >
            <ProductViewer3D 
              modelUrl={glbAssetUrl}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              scale={2.5}
            />
          </motion.div>
        )}

        {/* Minimal interaction hint */}
        {glbAssetUrl && (
          <div className="absolute bottom-10 left-10 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground/50 font-mono">
              [ EJE X/Y/Z DESBLOQUEADO ]
            </span>
          </div>
        )}
      </div>

      {/* 
        ========================================================
        RIGHT COLUMN: SWISS TYPOGRAPHY DETAILS
        ========================================================
      */}
      <div className="w-full lg:w-[45%] flex flex-col bg-background min-h-[100dvh]">
        <div className="flex-1 py-16 px-6 md:px-16 lg:py-24 max-w-2xl mx-auto w-full flex flex-col justify-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-16"
          >
            {/* Header Block */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[10px] font-mono tracking-[0.2em] uppercase">
                <span className={cn(
                  "font-bold",
                  displayedStock > 0 ? "text-foreground" : "text-destructive"
                )}>
                  {displayedStock > 0 ? 'Disponible' : 'Agotado'}
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">ID: {displayedSku}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.95]">
                {displayedName}
              </h1>

              <div className="text-4xl font-black tracking-tighter text-muted-foreground pt-2">
                {formatPrice(displayedPrice)}
              </div>
            </div>

            {/* Description Block */}
            <div className="space-y-6">
              <p className="text-lg text-foreground/70 leading-relaxed font-medium">
                {product.description || 'Ingeniería geométrica superior. Examina cada polígono en tiempo real. Este objeto ha sido digitalizado con tolerancia milimétrica.'}
              </p>
            </div>

            {/* Variants Block */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-2">
                  Especificaciones Modulares
                </h3>
                <div className="flex flex-col gap-3">
                  {product.variants.map((v: any) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVariant(isSelected ? null : v);
                          setActiveImageIndex(0);
                          if (v.stock < quantity) setQuantity(Math.max(1, v.stock));
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-b",
                          isSelected
                            ? "bg-foreground text-background border-transparent"
                            : "bg-transparent text-foreground border-border hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isSelected ? "bg-background" : "bg-transparent"
                          )} />
                          <span className="text-sm font-bold tracking-tight">{v.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className={isSelected ? "text-background/80" : "text-muted-foreground"}>
                            {formatPrice(v.price)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Block */}
            <div className="pt-8">
              {isAuthenticated ? (
                <div className="space-y-6">
                  {/* Quantity */}
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Volumen</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-lg font-mono font-bold w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(displayedStock, quantity + 1))}
                        disabled={quantity >= displayedStock}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Fluid CTAs */}
                  <div className="flex gap-4">
                    <motion.div 
                      whileTap={{ scale: 0.98 }} 
                      className="flex-1 relative group"
                    >
                      <button
                        onClick={handleAddToCart}
                        disabled={displayedStock === 0}
                        className="w-full h-14 flex items-center justify-center gap-3 bg-foreground text-background font-bold uppercase tracking-[0.1em] text-xs transition-colors hover:bg-foreground/90 disabled:opacity-50"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Añadir al Carrito
                      </button>
                    </motion.div>
                    
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <button
                        onClick={handleToggleFav}
                        className={cn(
                          "w-14 h-14 flex items-center justify-center border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          isFavorite 
                            ? "bg-foreground border-foreground text-background" 
                            : "bg-transparent border-border text-foreground hover:border-foreground"
                        )}
                      >
                        <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                      </button>
                    </motion.div>
                  </div>

                  {/* Notifications */}
                  <AnimatePresence>
                    {(addedNotify || favNotify) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 py-3 text-xs font-bold uppercase tracking-[0.1em] text-foreground border-b border-foreground/10"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {addedNotify ? `Adquisición Confirmada: ${quantity} unidades` : 'Protocolo de Favoritos Actualizado'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="p-8 bg-muted/20 border border-border">
                  <div className="flex items-start gap-4">
                    <Lock className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold tracking-tight text-foreground uppercase">Autenticación Requerida</h4>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          La adquisición de este elemento requiere credenciales verificadas. Inicia sesión para proceder.
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <Link href="/login" className="text-xs font-bold uppercase tracking-[0.1em] text-foreground border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors">
                          Iniciar Sesión
                        </Link>
                        <Link href="/register" className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground border-b border-transparent pb-1 hover:text-foreground hover:border-foreground transition-colors">
                          Registrarse
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </motion.div>
        </div>

        {/* 
          ========================================================
          REVIEWS COMPONENT (Integrated below the details pane)
          ========================================================
        */}
        <div className="px-6 md:px-16 py-16 bg-muted/10 border-t border-border">
          <ProductReviews productId={product.id} />
        </div>
      </div>
      
    </div>
  );
}
