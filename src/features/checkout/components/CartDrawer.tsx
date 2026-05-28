'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/features/checkout/hooks/useCart';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export function CartDrawer() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { items, updateQuantity, removeItem, totalItems, totalPrice } = useCart();

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value);
  };

  const handleCheckoutRedirect = () => {
    setOpen(false);
    router.push('/checkout');
  };

  const handleCartRedirect = () => {
    setOpen(false);
    router.push('/cart');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-11 w-11 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all transform active:scale-95 cursor-pointer"
          aria-label="Ver carrito"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1 bg-gradient-to-r from-primary to-secondary text-[10px] font-black border-2 border-background flex items-center justify-center rounded-full shadow-md shadow-primary/20">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col p-6 bg-card/95 backdrop-blur-xl border-l border-primary/5">
        <SheetHeader className="pb-4 border-b border-primary/5">
          <SheetTitle className="flex items-center gap-2 text-base font-heading font-extrabold tracking-wider uppercase text-foreground">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span>Mi Carrito ({totalItems})</span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-20">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary">
              <ShoppingCart className="h-7 w-7" />
            </div>
            <div className="space-y-1.5 max-w-[240px]">
              <h4 className="font-heading font-bold text-sm text-foreground">Tu carrito está vacío</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Agrega productos 3D desde nuestro catálogo para comenzar tu compra.
              </p>
            </div>
            <Button size="sm" onClick={() => setOpen(false)} className="bg-primary text-primary-foreground font-bold cursor-pointer rounded-xl h-9">
              Explorar Catálogo
            </Button>
          </div>
        ) : (
          <>
            {/* Scrollable Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 border-b border-primary/5 pb-4 last:border-b-0 last:pb-0 items-start">
                  {/* Thumbnail representation */}
                  <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center border-2 border-background shadow-sm animate-fade-in">
                      {quantity}
                    </span>
                  </div>

                  {/* Product details */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="font-bold text-xs text-foreground truncate leading-snug">
                      {product.name}
                    </h4>
                    <span className="text-[9px] font-bold text-muted-foreground font-mono uppercase block">
                      SKU: {product.sku}
                    </span>
                    <div className="text-xs font-black text-primary font-sans">
                      {formatPrice(product.price)}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 pt-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        disabled={quantity <= 1}
                        className="h-6 w-6 rounded-md border-primary/5 cursor-pointer"
                      >
                        <Minus className="h-2.5 w-2.5" />
                      </Button>
                      <span className="text-[11px] font-bold w-5 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="h-6 w-6 rounded-md border-primary/5 cursor-pointer"
                      >
                        <Plus className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="flex flex-col items-end justify-between h-full gap-4 shrink-0">
                    <button
                      onClick={() => removeItem(product.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      aria-label="Quitar producto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-bold text-foreground font-sans pt-1">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom calculation & checkout */}
            <div className="border-t border-primary/5 pt-4 space-y-4 mt-auto">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-muted-foreground font-bold">Total Estimado</span>
                <span className="text-lg font-black text-primary font-sans">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={handleCartRedirect}
                  className="h-10 text-xs font-bold border-primary/10 rounded-xl cursor-pointer"
                >
                  Ver Carrito
                </Button>
                
                <Button 
                  onClick={handleCheckoutRedirect}
                  className="h-10 text-xs font-bold bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl shadow-md shadow-primary/10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Pagar ahora</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
