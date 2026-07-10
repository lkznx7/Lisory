"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { mapApiProductToProduct, type ApiProduct } from "@/lib/mappers";
import { ProductCard } from "@/components/product/product-card";
import { products as fallbackProducts } from "@/constants/data";
import type { Product } from "@/types";

export function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get<ApiProduct[]>("/products/new-arrivals")
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data.map(mapApiProductToProduct));
        } else {
          setProducts(fallbackProducts.filter((p) => p.isNew));
        }
      })
      .catch(() => {
        setProducts(fallbackProducts.filter((p) => p.isNew));
      })
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-6 bg-[#FFF9F8]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <p className="text-xs tracking-[0.4em] text-[#D97D93] uppercase mb-4">Novidades</p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl lg:text-5xl font-light text-[#7A4B52]">
              Novos Scoops
            </h2>
          </div>
          <Link href="/category" className="hidden sm:flex items-center gap-2 text-sm text-[#6E5A5D] hover:text-[#D97D93] transition-colors">
            Ver todos <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
        <Link href="/category" className="flex sm:hidden items-center justify-center gap-2 mt-8 text-sm text-[#D97D93] font-medium">
          Ver todos <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}
