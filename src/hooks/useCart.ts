'use client';

import { useCartStore } from '@/stores/cart.store';
import { useState, useEffect } from 'react';

export function useCart() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    items: mounted ? items : [],
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems: mounted ? totalItems : 0,
    totalPrice: mounted ? totalPrice : 0,
    isHydrated: mounted,
  };
}
