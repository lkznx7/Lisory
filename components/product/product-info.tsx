"use client";

import { useState } from "react";
import { Plus, Minus, Check, Gift, Sparkles, Video, RefreshCw, Shield, Droplets } from "lucide-react";
import type { Product } from "@/types";
import { StarRating } from "./star-rating";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(product.id, product.name, product.price, product.image, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product.id, product.name, product.price, product.image);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs tracking-widest uppercase text-[#6E5A5D] mb-3">
          {product.category} Scoop
        </p>
        <h1 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#7A4B52] leading-tight mb-4">
          {product.name}
        </h1>
        <StarRating rating={product.rating} count={product.reviews} />
      </div>

      <div className="bg-white border border-[#F2DCDD] rounded-[18px] p-5">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-3xl font-semibold text-[#D97D93]">
            R${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-[#6E5A5D] line-through">
              R${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <p className="text-sm text-[#6E5A5D]">
          em até 12× de R${(product.price / 12).toFixed(2)} sem juros
        </p>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F2DCDD]">
          <Sparkles size={14} className="text-[#C8667F]" />
          <span className="text-sm text-[#C8667F] font-medium">
            Aço inoxidável · Não escurece
          </span>
        </div>
      </div>

      {product.scoop && (
        <div className="bg-[#FCEEEF] rounded-[18px] p-5">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#7A4B52] mb-4">
            Seu Scoop inclui
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Gift size={14} className="text-[#D97D93]" />
              <span className="text-sm text-[#6E5A5D]">{product.scoop.items} acessórios garantidos</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#D97D93]" />
              <span className="text-sm text-[#6E5A5D]">Aço inoxidável</span>
            </div>
            <div className="flex items-center gap-2">
              <Video size={14} className="text-[#D97D93]" />
              <span className="text-sm text-[#6E5A5D]">Vídeo exclusivo</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="text-[#D97D93]" />
              <span className="text-sm text-[#6E5A5D]">Até {product.scoop.exchanges} trocas</span>
            </div>
          </div>
        </div>
      )}

      {product.description && (
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#7A4B52] mb-3">
            Descrição
          </p>
          <p className="text-sm text-[#6E5A5D] leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-[#7A4B52] mb-3">
          Quantidade
        </p>
        <div className="flex items-center border border-[#F2DCDD] rounded-xl w-fit overflow-hidden">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-11 h-11 flex items-center justify-center hover:bg-[#FCEEEF] transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="w-12 text-center font-medium text-sm">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-11 h-11 flex items-center justify-center hover:bg-[#FCEEEF] transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          className={`w-full h-12 text-sm font-semibold tracking-wide rounded-xl transition-all duration-200 ${
            added
              ? "bg-[#3E8B5A] text-white"
              : "bg-[#D97D93] hover:bg-[#C8667F] text-white"
          }`}
        >
          {added ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={16} /> Adicionado!
            </span>
          ) : (
            "Adicionar ao Carrinho"
          )}
        </button>
        <button
          onClick={handleBuyNow}
          className="w-full h-12 bg-[#7A4B52] hover:bg-[#6A3B42] text-white text-sm font-semibold tracking-wide rounded-xl transition-colors duration-200"
        >
          Comprar Agora
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: <Gift size={14} />, text: "Acessórios surpresa" },
          { icon: <Droplets size={14} />, text: "Pode molhar" },
          { icon: <Shield size={14} />, text: "Compra 100% segura" },
          { icon: <Video size={14} />, text: "Vídeo exclusivo" },
        ].map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-2 p-3 bg-[#FCEEEF] rounded-xl"
          >
            <span className="text-[#D97D93] flex-shrink-0">{item.icon}</span>
            <span className="text-xs text-[#6E5A5D]">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
