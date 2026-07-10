"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { products } from "@/constants/data";
import { useWishlist } from "@/hooks/use-wishlist";
import { ProductCard } from "@/components/product/product-card";

export function WishlistPageContent() {
  const { items: wishlist } = useWishlist();
  const favProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#7A4B52] mb-10">
          Lista de Desejos
        </h1>
        {favProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <Heart size={56} className="text-[#F2DCDD]" />
            <p className="text-[#6E5A5D]">Sua lista de desejos está vazia</p>
            <Link
              href="/category"
              className="h-12 px-8 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center"
            >
              Explorar Scoops
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {favProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
