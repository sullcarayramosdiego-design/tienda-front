import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type  { Product } from '@/features/inventory';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQty = Math.min(product.stock, existingItem.quantity + quantity);
          set({
            items: items.map((item) =>
              item.product.id === product.id ? { ...item, quantity: newQty } : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: Math.min(product.stock, quantity) }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        const items = get().items;
        const targetItem = items.find((item) => item.product.id === productId);
        if (!targetItem) return;

        const sanitizedQty = Math.max(1, Math.min(targetItem.product.stock, quantity));
        set({
          items: items.map((item) =>
            item.product.id === productId ? { ...item, quantity: sanitizedQty } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },
    }),
    {
      name: 'tienda-cart-storage',
    }
  )
);
