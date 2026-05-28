'use client';

import { useWishlistStore } from '@/features/engagement/stores/wishlist.store';
import { useState, useEffect } from 'react';

export function useWishlist() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const isLoading = useWishlistStore((state) => state.isLoading);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const hasItem = useWishlistStore((state) => state.hasItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const syncWithBackend = useWishlistStore((state) => state.syncWithBackend);

  useEffect(() => {
    setMounted(true);
    // Sincronizar automáticamente al cargar el hook si hay sesión activa
    if (typeof window !== 'undefined' && localStorage.getItem('access_token')) {
      syncWithBackend();
    }
  }, [syncWithBackend]);

  return {
    items: mounted ? items : [],
    isLoading: mounted ? isLoading : false,
    toggleItem,
    removeItem,
    hasItem: mounted ? hasItem : () => false,
    clearWishlist,
    isHydrated: mounted,
  };
}
