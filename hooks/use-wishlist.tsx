"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface WishlistContextType {
  items: string[];
  toggleItem: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  const toggleItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback(
    (id: string) => items.includes(id),
    [items]
  );

  return (
    <WishlistContext.Provider value={{ items, toggleItem, isFavorite }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
