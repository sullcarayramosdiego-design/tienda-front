import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type  { Product } from '@/features/inventory';
import { wishlistService } from '@/features/engagement/services/wishlist.service';

interface WishlistState {
  items: Product[];
  isLoading: boolean;
  toggleItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  hasItem: (productId: string) => boolean;
  clearWishlist: () => void;
  syncWithBackend: () => Promise<void>;
}

// Auxiliar para saber si el usuario está autenticado lógicamente en el cliente
const getIsAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      toggleItem: async (product) => {
        const items = get().items;
        const exists = items.some((item) => item.id === product.id);
        const authenticated = getIsAuthenticated();

        if (exists) {
          // Remover
          set({ items: items.filter((item) => item.id !== product.id) });
          if (authenticated) {
            try {
              await wishlistService.removeFromWishlist(product.id);
            } catch (error) {
              console.error('Error al remover de favoritos en backend:', error);
            }
          }
        } else {
          // Agregar
          set({ items: [...items, product] });
          if (authenticated) {
            try {
              await wishlistService.addToWishlist(product.id);
            } catch (error) {
              console.error('Error al agregar a favoritos en backend:', error);
            }
          }
        }
      },

      removeItem: async (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
        if (getIsAuthenticated()) {
          try {
            await wishlistService.removeFromWishlist(productId);
          } catch (error) {
            console.error('Error al remover de favoritos en backend:', error);
          }
        }
      },

      hasItem: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      clearWishlist: () => set({ items: [] }),

      syncWithBackend: async () => {
        if (!getIsAuthenticated()) return;
        
        set({ isLoading: true });
        try {
          // 1. Descargar favoritos actuales del backend
          const backendItems = await wishlistService.getWishlist();
          
          // 2. Subir favoritos locales que no existan en el servidor
          const localItems = get().items;
          const mergedItems = [...backendItems];

          for (const localItem of localItems) {
            const alreadyInBackend = backendItems.some((b) => b.id === localItem.id);
            if (!alreadyInBackend) {
              try {
                await wishlistService.addToWishlist(localItem.id);
                mergedItems.push(localItem);
              } catch (err) {
                console.error(`Error sincronizando producto ${localItem.id} al backend:`, err);
              }
            }
          }

          set({ items: mergedItems, isLoading: false });
        } catch (error) {
          console.error('Error sincronizando favoritos con backend:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'tienda-wishlist-storage',
    }
  )
);
