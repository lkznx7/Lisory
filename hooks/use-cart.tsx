"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { formatProductPrice } from "@/lib/utils";

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
          price: formatProductPrice(Number(item.unitPrice)),
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
        await api.post<ApiCartResponse>("/cart/items", { productId: productId, quantity: qty });
        await refreshCart();
      } catch (e) {
        setItems((prev) => {
          const existing = prev.find((i) => i.id === productId);
          if (existing && existing.qty > qty) {
            return prev.map((i) => (i.id === productId ? { ...i, qty: i.qty - qty } : i));
          }
          return prev.filter((i) => i.id !== productId);
        });
        toast.error(e instanceof Error ? e.message : "Erro ao adicionar produto ao carrinho");
      }
    },
    [refreshCart]
  );

  const removeItem = useCallback(
    async (id: string) => {
      const localItem = items.find((i) => i.id === id);
      setItems((prev) => prev.filter((i) => i.id !== id));

      try {
        let backendItemId = localItem?.backendCartItemId;
        if (!backendItemId) {
          const currentState = await api.get<ApiCartResponse>("/cart");
          const backendItem = currentState.items.find(
            (i) => i.productId === id || (localItem && i.productName === localItem.name)
          );
          backendItemId = backendItem?.id;
        }

        if (backendItemId) {
          await api.delete(`/cart/items/${backendItemId}`);
        }
        await refreshCart();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Erro ao remover produto");
        await refreshCart();
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
      const localItem = items.find((i) => i.id === id);
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));

      try {
        let backendItemId = localItem?.backendCartItemId;
        if (!backendItemId) {
          const currentState = await api.get<ApiCartResponse>("/cart");
          const backendItem = currentState.items.find(
            (i) => i.productId === id || (localItem && i.productName === localItem.name)
          );
          backendItemId = backendItem?.id;
        }

        if (backendItemId) {
          await api.put(`/cart/items/${backendItemId}`, { quantity: qty });
        }
        await refreshCart();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Erro ao atualizar quantidade");
        await refreshCart();
      }
    },
    [items, refreshCart, removeItem]
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("lisory_applied_coupon");
    }
    try {
      await api.delete("/cart");
    } catch {
      // Silently handle cart clear failure
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
