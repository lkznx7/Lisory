"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Shield,
  RefreshCw,
  Gift,
  Tag,
  Loader2,
  MapPin,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";
import { shippingService } from "@/services/shipping.service";
import { ShippingOption } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function CartPageContent() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [zipCode, setZipCode] = useState("");
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const calculateFreight = async (code: string) => {
    if (!code || code.length !== 8) return;
    setLoadingShipping(true);
    try {
      const freightItems = items.map((item) => ({
        productId: item.id,
        quantity: item.qty,
        weight: 0.5,
        width: 15,
        height: 5,
        length: 20,
      }));
      const options = await shippingService.calculateFreight({ zipCode: code, items: freightItems });
      if (options.length > 0) {
        setSelectedShipping(options[0]);
        setShippingCost(options[0].cost);
      }
    } catch {
      setShippingCost(null);
      toast.error("Erro ao calcular frete. Tente novamente.");
    } finally {
      setLoadingShipping(false);
    }
  };

  useEffect(() => {
    if (zipCode.length === 8) {
      calculateFreight(zipCode);
    }
  }, [zipCode]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setLoadingCoupon(true);
    try {
      const result = await api.post<{ discountType: string; discountValue: number; code: string }>(
        "/coupons/validate",
        { code: couponCode.trim(), orderValue: totalPrice }
      );
      let discount = 0;
      if (result.discountType === "PERCENTAGE") {
        discount = (totalPrice * result.discountValue) / 100;
      } else {
        discount = Math.min(result.discountValue, totalPrice);
      }
      setAppliedCoupon({ code: result.code, discount });
      toast.success("Cupom aplicado com sucesso!");
    } catch {
      toast.error("Cupom invalido ou expirado");
      setAppliedCoupon(null);
    } finally {
      setLoadingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const shipping = shippingCost !== null ? shippingCost : (totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 19.9);
  const discount = appliedCoupon?.discount || 0;
  const total = totalPrice - discount + shipping;

  return (
    <main className="pt-[72px] sm:pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 sm:py-12">
        <h1 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-light text-[#7A4B52] mb-6 sm:mb-10">
          Carrinho de Compras
        </h1>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <ShoppingBag size={56} className="text-[#F2DCDD]" />
            <p className="text-[#6E5A5D]">Seu carrinho está vazio</p>
            <Link
              href="/category"
              className="h-12 px-8 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center"
            >
              Explorar Scoops
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="flex gap-3 sm:gap-5 bg-white border border-[#F2DCDD] rounded-[18px] p-3 sm:p-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-[14px] bg-[#FCEEEF] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#7A4B52]">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#6E5A5D] hover:text-[#D64F4F] transition-colors flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-[#D97D93] font-semibold mt-1">
                      R${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#F2DCDD] rounded-[10px] overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.qty - 1)
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-[#FCEEEF] transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-[#FCEEEF] transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-[#7A4B52]">
                        R${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-[#F2DCDD] rounded-[18px] p-6 space-y-4">
                <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#7A4B52]">
                  Resumo
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6E5A5D]">Subtotal</span>
                    <span className="text-[#7A4B52] font-medium">
                      R${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#3E8B5A]">Desconto</span>
                      <span className="text-[#3E8B5A] font-medium">
                        -R${discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 border border-[#F2DCDD] rounded-[10px] px-3 h-10">
                    <MapPin size={14} className="text-[#6E5A5D]" />
                    <input
                      placeholder="Calcular frete (CEP)"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                      className="flex-1 text-sm bg-transparent outline-none placeholder-[#6E5A5D]"
                    />
                    {loadingShipping && <Loader2 size={14} className="text-[#6E5A5D] animate-spin" />}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6E5A5D]">Frete</span>
                    <span
                      className={
                        shipping === 0
                          ? "text-[#3E8B5A] font-medium"
                          : "text-[#7A4B52] font-medium"
                      }
                    >
                      {loadingShipping
                        ? "Calculando..."
                        : shipping === 0
                          ? "Gratis"
                          : `R$ ${shipping.toFixed(2).replace(".", ",")}`}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#F2DCDD] flex justify-between">
                  <span className="font-semibold text-[#7A4B52]">Total</span>
                  <span className="text-xl font-semibold text-[#D97D93]">
                    R${total.toFixed(2)}
                  </span>
                </div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#FCEEEF] rounded-[10px] px-3 h-10">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-[#3E8B5A]" />
                      <span className="text-sm font-medium text-[#3E8B5A]">{appliedCoupon.code}</span>
                      <span className="text-xs text-[#6E5A5D]">(-R${appliedCoupon.discount.toFixed(2)})</span>
                    </div>
                    <button onClick={removeCoupon} className="text-xs text-[#D64F4F] hover:underline">
                      Remover
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <div className="flex-1 flex items-center gap-2 border border-[#F2DCDD] rounded-[10px] px-3 h-10">
                      <Tag size={14} className="text-[#6E5A5D]" />
                      <input
                        placeholder="Cupom de desconto"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 text-sm bg-transparent outline-none placeholder-[#6E5A5D]"
                      />
                    </div>
                    <button
                      onClick={applyCoupon}
                      disabled={loadingCoupon || !couponCode.trim()}
                      className="h-10 px-4 border border-[#F2DCDD] hover:border-[#D97D93] text-sm text-[#6E5A5D] hover:text-[#D97D93] rounded-[10px] transition-colors whitespace-nowrap disabled:opacity-50"
                    >
                      {loadingCoupon ? "..." : "Aplicar"}
                    </button>
                  </div>
                )}
                <Link
                  href="/checkout"
                  className="w-full h-12 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center"
                >
                  Finalizar Compra
                </Link>
                <Link
                  href="/category"
                  className="w-full h-10 text-sm text-[#6E5A5D] hover:text-[#D97D93] transition-colors flex items-center justify-center"
                >
                  Continuar Comprando
                </Link>
              </div>

              <div className="bg-[#FCEEEF] rounded-[18px] p-5 space-y-3">
                {[
                  { icon: <Shield size={14} />, text: "Pagamento 100% seguro" },
                  {
                    icon: <RefreshCw size={14} />,
                    text: "Troca garantida",
                  },
                  {
                    icon: <Gift size={14} />,
                    text: "Experiencia surpresa",
                  },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <span className="text-[#D97D93]">{item.icon}</span>
                    <span className="text-xs text-[#6E5A5D]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
