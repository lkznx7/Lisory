"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Gift, Diamond, Sparkles, Crown } from "lucide-react";
import { api } from "@/lib/api";
import { type ApiCategory } from "@/lib/mappers";
import { products as fallbackProducts } from "@/constants/data";

const iconMap: Record<string, typeof Gift> = {
  scoop: Gift,
  dourados: Diamond,
  prata: Sparkles,
};

const fallbackIcons = [Gift, Sparkles, Diamond, Crown, Crown];
const fallbackOptions = [
  { name: "Primeira Surpresa", items: 4, price: "R$ 119,90", slug: "primeira-surpresa" },
  { name: "Brilho em Dobro", items: 6, price: "R$ 230", slug: "brilho-em-dobro" },
  { name: "Colecao de Sonhos", items: 9, price: "R$ 290", slug: "colecao-de-sonhos" },
  { name: "Experiencia Premium", items: 12, price: "R$ 350", slug: "experiencia-premium" },
  { name: "Pulseiras", items: 0, price: "Em breve", slug: "pulseiras" },
];

export function CategoriesSection() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    api
      .get<ApiCategory[]>("/categories")
      .then((data) => {
        if (data && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(() => {
        // Categories unavailable, fallback UI will be shown
      });
  }, []);

  if (categories.length > 0) {
    return (
      <section id="scoops" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs tracking-[0.4em] text-[#D97D93] uppercase mb-4">Escolha seu nivel</p>
          <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl lg:text-5xl font-light text-[#7A4B52]">Nossas Categorias</h2>
          <p className="text-[#6E5A5D] text-sm mt-4 max-w-md mx-auto">Explore nossas categorias de acessorios e scoops.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.slug] || fallbackIcons[i % fallbackIcons.length];
            return (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                <Link href={`/category?category=${cat.slug}`} className="group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-[18px] bg-gradient-to-b from-[#F8E6E8] to-[#FFF9F8] border border-[#F2DCDD] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D97D93] to-[#C98A96] rounded-2xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={26} className="text-white" />
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-semibold text-[#7A4B52] mb-2">{cat.name}</h3>
                  <p className="text-xs sm:text-sm text-[#6E5A5D] mb-3">{cat.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section id="scoops" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10 sm:mb-14">
        <p className="text-xs tracking-[0.4em] text-[#D97D93] uppercase mb-4">Escolha seu nivel</p>
        <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl lg:text-5xl font-light text-[#7A4B52]">Nossos Scoops</h2>
        <p className="text-[#6E5A5D] text-sm mt-4 max-w-md mx-auto">Quanto maior o scoop, mais acessorios, mais surpresas e mais emocao.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {fallbackOptions.map((scoop, i) => {
          const Icon = fallbackIcons[i];
          return (
            <motion.div key={scoop.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
              <Link href={scoop.slug === "pulseiras" ? `/category?category=pulseiras` : `/product/${scoop.slug}`} className="group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-[18px] bg-gradient-to-b from-[#F8E6E8] to-[#FFF9F8] border border-[#F2DCDD] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D97D93] to-[#C98A96] rounded-2xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-semibold text-[#7A4B52] mb-2">{scoop.name}</h3>
                <p className="text-xs sm:text-sm text-[#6E5A5D] mb-3">{scoop.items} acessorios</p>
                {scoop.slug === "pulseiras" ? (
                  <span className="text-xs sm:text-sm text-[#6E5A5D] mt-2">Em breve</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-[#D97D93]">{scoop.price}</span>
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
