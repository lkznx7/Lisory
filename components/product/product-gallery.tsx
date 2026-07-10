"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Gift } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "./badge";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const { isFavorite, toggleItem } = useWishlist();
  const isFav = isFavorite(product.id);

  const images = [
    product.image,
    ...(product.hoverImage ? [product.hoverImage] : []),
  ].filter(Boolean);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3 w-20 flex-shrink-0">
        {images.slice(0, 4).map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(i)}
            className={`aspect-square overflow-hidden rounded-xl border-2 transition-all ${
              selectedImage === i
                ? "border-[#D97D93]"
                : "border-[#F2DCDD] hover:border-[#C98A96]"
            }`}
          >
            {img ? (
              <Image
                src={img}
                alt=""
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#FCEEEF] flex items-center justify-center">
                <Gift size={20} className="text-[#D97D93]/50" />
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 relative aspect-[4/5] bg-[#FCEEEF] rounded-[20px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            className="relative w-full h-full"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {images[selectedImage] ? (
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F8D8D3] to-[#FCEEEF]">
                <Gift size={80} className="text-[#D97D93]/30" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {product.badge && (
          <div className="absolute top-4 left-4">
            <Badge variant="rose">{product.badge}</Badge>
          </div>
        )}
        <button
          onClick={() => toggleItem(product.id)}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart
            size={18}
            className={
              isFav ? "fill-[#D97D93] text-[#D97D93]" : "text-[#6E5A5D]"
            }
          />
        </button>
      </div>
    </div>
  );
}
