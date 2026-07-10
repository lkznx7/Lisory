"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Heart, Gift } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "./badge";
import { StarRating } from "./star-rating";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCart();
  const { isFavorite, toggleItem } = useWishlist();
  const isFav = isFavorite(product.id);

  return (
    <motion.div
      className={cn(
        "group relative bg-white rounded-[18px] border border-[#F2DCDD] overflow-hidden cursor-pointer",
        className
      )}
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#FCEEEF]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
              style={{ borderRadius: "18px 18px 0 0" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F8D8D3] to-[#FCEEEF]">
              <Gift size={48} className="text-[#D97D93]/50" />
            </div>
          )}

          {product.badge && (
            <div className="absolute top-3 left-3">
              <Badge
                variant={
                  product.badge === "Novo"
                    ? "rose"
                    : product.badge === "Premium"
                      ? "default"
                      : "champagne"
                }
              >
                {product.badge}
              </Badge>
            </div>
          )}

          {product.scoop && (
            <div className="absolute top-3 right-3">
              <Badge variant="outline">
                {product.scoop.items} itens
              </Badge>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleItem(product.id);
            }}
            className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow-sm hover:scale-110 transition-transform duration-150"
            aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart
              size={14}
              className={
                isFav ? "fill-[#D97D93] text-[#D97D93]" : "text-[#6E5A5D]"
              }
            />
          </button>

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(product.id, product.name, product.price, product.image);
              }}
              className="w-full h-10 bg-[#D97D93]/90 backdrop-blur-sm text-white text-xs font-semibold tracking-wider rounded-[10px] hover:bg-[#C8667F] transition-colors duration-200"
            >
              Adicionar ao Carrinho
            </button>
          </motion.div>
        </div>
      </Link>

      <Link href={`/product/${product.id}`} className="block p-4">
        <p className="text-xs text-[#6E5A5D] tracking-wide uppercase mb-1">
          {product.category} Scoop
        </p>
        <h3 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#7A4B52] leading-tight mb-2">
          {product.name}
        </h3>
        <StarRating rating={product.rating} count={product.reviews} />
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[#D97D93] font-semibold">
            R${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-[#6E5A5D] text-sm line-through">
              R${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <p className="text-[10px] text-[#6E5A5D] mt-0.5">
          em até 12× R${(product.price / 12).toFixed(2)}
        </p>
      </Link>
    </motion.div>
  );
}
