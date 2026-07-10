"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ChevronRight, ChevronDown, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { api } from "@/lib/api";
import { mapApiProductToProduct, type ApiProduct, type ApiCategory } from "@/lib/mappers";
import { SORT_OPTIONS, PRICE_RANGES } from "@/constants";
import { ProductCard } from "@/components/product/product-card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { Product } from "@/types";

export function CategoryPageContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState("Mais Vendidos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categorySlug);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<ApiCategory[]>("/categories"),
    ]).then(([cats]) => {
      setCategories(cats);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) params.set("categoryId", cat.id);
    }
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
    if (priceRange[1] < 500) params.set("maxPrice", String(priceRange[1]));

    const query = params.toString();
    api.get<{ content: ApiProduct[] }>(`/products?size=50${query ? `&${query}` : ""}`)
      .then((data) => {
        setProducts(data.content.map(mapApiProductToProduct));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, priceRange, categories]);

  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        <div className="flex items-center gap-2 text-xs text-[#6E5A5D]">
          <Link href="/" className="hover:text-[#D97D93] transition-colors">
            Inicio
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#7A4B52]">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || "Produtos"
              : "Todos os Produtos"}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#7A4B52]">
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name || "Produtos"
                : "Todos os Produtos"}
            </h1>
            <p className="text-sm text-[#6E5A5D] mt-2">{products.length} produtos</p>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="space-y-8 sticky top-28">
              <div>
                <h3 className="text-xs font-semibold tracking-widest uppercase text-[#7A4B52] mb-4">
                  Categorias
                </h3>
                <div className="space-y-3">
                  <label
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        !selectedCategory
                          ? "border-[#D97D93]"
                          : "border-[#F2DCDD] group-hover:border-[#D97D93]"
                      }`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      {!selectedCategory && (
                        <div className="w-2 h-2 bg-[#D97D93] rounded-full" />
                      )}
                    </div>
                    <span className="text-sm text-[#6E5A5D] group-hover:text-[#7A4B52] transition-colors">
                      Todos
                    </span>
                  </label>
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          selectedCategory === cat.slug
                            ? "border-[#D97D93]"
                            : "border-[#F2DCDD] group-hover:border-[#D97D93]"
                        }`}
                        onClick={() => setSelectedCategory(cat.slug)}
                      >
                        {selectedCategory === cat.slug && (
                          <div className="w-2 h-2 bg-[#D97D93] rounded-full" />
                        )}
                      </div>
                      <span className="text-sm text-[#6E5A5D] group-hover:text-[#7A4B52] transition-colors">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold tracking-widest uppercase text-[#7A4B52] mb-4">
                  Preco
                </h3>
                <div className="space-y-3">
                  {PRICE_RANGES.map(({ min, max }) => (
                    <label
                      key={`${min}-${max}`}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          priceRange[0] === min && priceRange[1] === max
                            ? "border-[#D97D93]"
                            : "border-[#F2DCDD] group-hover:border-[#D97D93]"
                        }`}
                        onClick={() => setPriceRange([min, max])}
                      >
                        {priceRange[0] === min && priceRange[1] === max && (
                          <div className="w-2 h-2 bg-[#D97D93] rounded-full" />
                        )}
                      </div>
                      <span className="text-sm text-[#6E5A5D] group-hover:text-[#7A4B52] transition-colors">
                        R${min} – R${max === 500 ? "500+" : max}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {(priceRange[0] > 0 || selectedCategory) && (
                <button
                  onClick={() => {
                    setPriceRange([0, 500]);
                    setSelectedCategory(null);
                  }}
                  className="text-xs text-[#D97D93] underline underline-offset-2"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button
                  className="lg:hidden flex items-center gap-2 h-9 px-4 border border-[#F2DCDD] rounded-[10px] text-sm text-[#6E5A5D] hover:border-[#D97D93] transition-colors"
                  onClick={() => setFiltersOpen(true)}
                >
                  <SlidersHorizontal size={14} /> Filtros
                </button>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-9 pl-3 pr-8 bg-white border border-[#F2DCDD] rounded-[10px] text-sm text-[#6E5A5D] outline-none appearance-none cursor-pointer hover:border-[#D97D93] transition-colors"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E5A5D] pointer-events-none"
                  />
                </div>
                <div className="flex border border-[#F2DCDD] rounded-[10px] overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`w-9 h-9 flex items-center justify-center transition-colors ${
                      viewMode === "grid"
                        ? "bg-[#D97D93] text-white"
                        : "text-[#6E5A5D] hover:bg-[#FCEEEF]"
                    }`}
                  >
                    <Grid3X3 size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`w-9 h-9 flex items-center justify-center transition-colors ${
                      viewMode === "list"
                        ? "bg-[#D97D93] text-white"
                        : "text-[#6E5A5D] hover:bg-[#FCEEEF]"
                    }`}
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white border border-[#F2DCDD] rounded-[18px] overflow-hidden animate-pulse">
                    <div className="aspect-[4/5] bg-[#FCEEEF]" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-[#FCEEEF] rounded w-1/3" />
                      <div className="h-4 bg-[#FCEEEF] rounded w-2/3" />
                      <div className="h-3 bg-[#FCEEEF] rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`grid gap-4 lg:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {products.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    {viewMode === "grid" ? (
                      <ProductCard product={p} />
                    ) : (
                      <div
                        className="flex gap-5 bg-white border border-[#F2DCDD] rounded-[18px] p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <Link href={`/product/${p.id}`} className="flex gap-5 flex-1">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-28 h-28 object-cover rounded-[14px] bg-[#FCEEEF]"
                          />
                          <div className="flex-1">
                            <p className="text-xs text-[#6E5A5D] uppercase tracking-wide mb-1">
                              {p.category}
                            </p>
                            <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#7A4B52]">
                              {p.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[#D97D93] font-semibold">
                                R${p.price.toFixed(2)}
                              </span>
                              {p.originalPrice && (
                                <span className="text-[#6E5A5D] text-sm line-through">
                                  R${p.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DrawerContent className="bg-[#FFF9F8]">
          <DrawerHeader className="border-b border-[#F2DCDD]">
            <DrawerTitle className="text-sm font-semibold text-[#7A4B52]">Filtros</DrawerTitle>
          </DrawerHeader>
          <div className="p-6 space-y-8 overflow-y-auto">
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[#7A4B52] mb-4">
                Categorias
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      !selectedCategory ? "border-[#D97D93]" : "border-[#F2DCDD]"
                    }`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    {!selectedCategory && (
                      <div className="w-2 h-2 bg-[#D97D93] rounded-full" />
                    )}
                  </div>
                  <span className="text-sm text-[#6E5A5D]">Todos</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        selectedCategory === cat.slug ? "border-[#D97D93]" : "border-[#F2DCDD]"
                      }`}
                      onClick={() => setSelectedCategory(cat.slug)}
                    >
                      {selectedCategory === cat.slug && (
                        <div className="w-2 h-2 bg-[#D97D93] rounded-full" />
                      )}
                    </div>
                    <span className="text-sm text-[#6E5A5D]">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[#7A4B52] mb-4">
                Preco
              </h3>
              <div className="space-y-3">
                {PRICE_RANGES.map(({ min, max }) => (
                  <label key={`${min}-${max}`} className="flex items-center gap-3 cursor-pointer">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        priceRange[0] === min && priceRange[1] === max
                          ? "border-[#D97D93]"
                          : "border-[#F2DCDD]"
                      }`}
                      onClick={() => setPriceRange([min, max])}
                    >
                      {priceRange[0] === min && priceRange[1] === max && (
                        <div className="w-2 h-2 bg-[#D97D93] rounded-full" />
                      )}
                    </div>
                    <span className="text-sm text-[#6E5A5D]">R${min} – R${max === 500 ? "500+" : max}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                setPriceRange([0, 500]);
                setSelectedCategory(null);
              }}
              className="text-xs text-[#D97D93] underline underline-offset-2"
            >
              Limpar filtros
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  );
}
