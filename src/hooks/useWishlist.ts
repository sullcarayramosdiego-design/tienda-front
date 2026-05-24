'use client';

import { useWishlistStore } from '@/stores/wishlist.store';
import { useState, useEffect } from 'react';

export function useWishlist() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const hasItem = useWishlistStore((state) => state.hasItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    items: mounted ? items : [],
    toggleItem,
    removeItem,
    hasItem: mounted ? hasItem : () => false,
    clearWishlist,
    isHydrated: mounted,
  };
}
