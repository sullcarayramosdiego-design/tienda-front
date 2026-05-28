'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/features/checkout/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Sparkles,
  Award,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();

  // Format price in local Peruvian Soles (S/)
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value);
  };

  // Estimated shipping logic
  const shippingCost = totalPrice > 250 || totalPrice === 0 ? 0 : 15;
  const grandTotal = totalPrice + shippingCost;

  // Estimated points earned (1 point per 2 PEN)
  const loyaltyPointsEarned = Math.floor(totalPrice / 2);

  const handleCheckoutRedirect = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary animate-bounce" style={{ animationDuration: '3s' }}>
          <ShoppingBag className="h-10 w-10" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">Tu carrito está vacío</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Parece que aún no has agregado productos 3D a tu carrito. ¡Explora nuestro catálogo tridimensional y vive la experiencia!
          </p>
        </div>
        <Button asChild size="lg" className="rounded-2xl bg-primary hover:bg-primary/95 shadow-md shadow-primary/15 font-bold cursor-pointer h-12 px-8">
          <Link href="/catalog" className="flex items-center gap-2">
            <ArrowLeft className="h-4.5 w-4.5" />
            Explorar Catálogo 3D
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground">
          Mi Carrito de Compras
        </h1>
        <p className="text-sm text-muted-foreground font-semibold">
          Tienes <span className="text-foreground font-bold">{totalItems}</span> {totalItems === 1 ? 'producto' : 'productos'} en tu lista de compra.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================== */}
        {/* LEFT COLUMN - Cart Items List              */}
        {/* ========================================== */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-primary/5 pb-2">
            <h3 className="font-heading font-bold text-lg text-foreground">Detalle del Pedido</h3>
            <button
              onClick={clearCart}
              className="text-xs font-bold text-destructive hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Vaciar Carrito
            </button>
          </div>

          <div className="space-y-4">
            {items.map(({ product, quantity }) => (
              <Card key={product.id} className="border-primary/10 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  {/* Product Image representation */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 border border-primary/15 flex items-center justify-center shrink-0">
                    {/* Quantity Badge on top-left corner */}
                    <span className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center border-2 border-background shadow-md shadow-primary/25 animate-fade-in select-none">
                      x{quantity}
                    </span>
                    
                    <ShoppingBag className="h-8 w-8 text-primary" />
                    {product.assets && product.assets.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 text-[8px] font-black bg-primary text-primary-foreground border border-primary/20 rounded-md shadow-sm uppercase tracking-wider scale-90">
                        3D
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <span className="text-[9px] font-bold text-muted-foreground font-mono uppercase tracking-wider block">
                      SKU: {product.sku}
                    </span>
                    <h4 className="font-heading font-extrabold text-base text-foreground leading-snug">
                      {product.name}
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-md line-clamp-1">
                      {product.description || 'Experiencia tridimensional optimizada en WebGL.'}
                    </p>
                    <div className="text-sm font-bold text-primary font-sans pt-1">
                      {formatPrice(product.price)} <span className="text-[10px] font-semibold text-muted-foreground">c/u</span>
                    </div>
                  </div>

                  {/* Quantity & Actions Area */}
                  <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 sm:gap-3 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                    {/* Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        disabled={quantity <= 1}
                        className="h-8 w-8 rounded-lg border-primary/10 cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-xs font-bold w-6 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="h-8 w-8 rounded-lg border-primary/10 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3.5">
                      {/* Subtotal */}
                      <span className="text-sm font-heading font-extrabold text-foreground">
                        {formatPrice(product.price * quantity)}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(product.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg border border-transparent hover:border-destructive/10 transition-colors cursor-pointer"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>

          {/* Guest Back links */}
          <Link href="/catalog" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline pt-2">
            <ArrowLeft className="h-4 w-4" />
            Seguir explorando productos 3D
          </Link>
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN - Order Summary Panel         */}
        {/* ========================================== */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          <h3 className="font-heading font-bold text-lg text-foreground border-b border-primary/5 pb-2">Resumen</h3>
          
          <Card className="border-primary/10 bg-card/60 backdrop-blur-md shadow-lg overflow-hidden">
            <CardContent className="p-6 space-y-6">
              
              {/* Financial values */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground font-semibold">
                  <span>Subtotal</span>
                  <span className="text-foreground font-bold">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1.5">
                    Envío nacional
                    {shippingCost === 0 && (
                      <span className="px-1.5 py-0.5 text-[8px] font-black bg-[#00D47C]/15 border border-[#00D47C]/20 text-[#00AF66] rounded uppercase">Gratis</span>
                    )}
                  </span>
                  <span className="text-foreground font-bold">
                    {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    * Agrega <span className="font-bold text-primary">{formatPrice(250 - totalPrice)}</span> más para obtener <strong>Envío Gratis</strong>.
                  </p>
                )}

                <hr className="border-primary/5 pt-1" />

                <div className="flex items-end justify-between">
                  <span className="text-base font-heading font-bold text-foreground">Total Estimado</span>
                  <span className="text-2xl font-heading font-black text-primary">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Club 3D Points Badge */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/15 bg-primary/5">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Award className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-primary tracking-wider block">Club 3D Experiencia</span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Ganarás <strong className="text-foreground font-extrabold">+{loyaltyPointsEarned} Pts</strong> con este pedido.
                  </span>
                </div>
              </div>

              {/* Secure checkout CTA button */}
              <Button
                onClick={handleCheckoutRedirect}
                className="w-full h-12 font-bold tracking-wider bg-primary hover:bg-primary/95 text-primary-foreground rounded-2xl shadow-lg shadow-primary/15 cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceder al Pago</span>
                <ArrowRight className="h-5 w-5" />
              </Button>

              {/* Accepted local Peru payment options representations */}
              <div className="space-y-3 pt-2">
                <span className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  <Wallet className="h-3.5 w-3.5 text-primary" /> Métodos de Pago Habilitados:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="px-2 py-1.5 text-center text-[9px] font-extrabold rounded-lg bg-card border border-primary/5 text-[#00AF66] shadow-sm select-none uppercase tracking-wider">
                    Yape
                  </div>
                  <div className="px-2 py-1.5 text-center text-[9px] font-extrabold rounded-lg bg-card border border-primary/5 text-[#00A8A9] shadow-sm select-none uppercase tracking-wider">
                    Plin
                  </div>
                  <div className="px-2 py-1.5 text-center text-[9px] font-extrabold rounded-lg bg-card border border-primary/5 text-[#E05300] shadow-sm select-none uppercase tracking-wider">
                    Efectivo
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Secure Trust row */}
          <div className="space-y-3 px-2">
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-semibold">
              <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0" />
              <span>Transacciones seguras y encriptadas.</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-semibold">
              <Truck className="h-4.5 w-4.5 text-primary shrink-0" />
              <span>Garantía de Satisfacción 3D y devoluciones flexibles.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
