"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/types";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductCard } from "@/components/product/product-card";

interface ProductDetailContentProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailContent({ product, relatedProducts }: ProductDetailContentProps) {
  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex items-center gap-2 text-xs text-[#6E5A5D] mb-8">
          <Link href="/" className="hover:text-[#D97D93] transition-colors">
            Inicio
          </Link>
          <ChevronRight size={12} />
          <Link
            href="/category"
            className="hover:text-[#D97D93] transition-colors"
          >
            Produtos
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#7A4B52]">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52] mb-8">
              Outros Produtos
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
