"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { api } from "@/lib/api";

interface ApiCartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface ApiCartResponse {
  id: string | null;
  items: ApiCartItem[];
  subtotal: number;
}

export interface CartItemUI {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  backendCartItemId?: string;
}

interface CartContextType {
  items: CartItemUI[];
  addItem: (productId: string, name: string, price: number, image: string, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  totalCount: number;
  totalPrice: number;
  clearCart: () => void;
  cartId: string | null;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemUI[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.get<ApiCartResponse>("/cart");
      setCartId(data.id);
      setItems(
        data.items.map((item) => ({
          id: item.productId,
          name: item.productName,
          price: Number(item.unitPrice),
          qty: item.quantity,
          image: item.productImage || "/images/scoop-1.jpg",
          backendCartItemId: item.id,
        }))
      );
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (productId: string, name: string, price: number, image: string, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === productId);
        if (existing) {
          return prev.map((i) => (i.id === productId ? { ...i, qty: i.qty + qty } : i));
        }
        return [...prev, { id: productId, name, price, qty, image }];
      });

      try {
        await api.post<ApiCartResponse>("/cart/items", { productId, quantity: qty });
        await refreshCart();
      } catch (e) {
        console.error("Failed to add to cart:", e);
      }
    },
    [refreshCart]
  );

  const removeItem = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      setItems((prev) => prev.filter((i) => i.id !== id));

      if (item?.backendCartItemId) {
        try {
          await api.delete(`/cart/items/${item.backendCartItemId}`);
          await refreshCart();
        } catch (e) {
          console.error("Failed to remove from cart:", e);
        }
      }
    },
    [items, refreshCart]
  );

  const updateQuantity = useCallback(
    async (id: string, qty: number) => {
      if (qty <= 0) {
        removeItem(id);
        return;
      }
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));

      const item = items.find((i) => i.id === id);
      if (item?.backendCartItemId) {
        try {
          await api.put(`/cart/items/${item.backendCartItemId}`, { quantity: qty });
          await refreshCart();
        } catch (e) {
          console.error("Failed to update cart:", e);
        }
      }
    },
    [items, refreshCart, removeItem]
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    try {
      await api.delete("/cart");
    } catch (e) {
      console.error("Failed to clear cart:", e);
    }
  }, []);

  const totalCount = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, totalCount, totalPrice, clearCart, cartId, isLoading, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
