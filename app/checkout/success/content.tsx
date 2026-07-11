"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check, Gift, Package } from "lucide-react";

export function CheckoutSuccessContent() {
  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8] flex items-center justify-center px-4 lg:px-6">
      <motion.div
        className="max-w-lg w-full text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 bg-[#3E8B5A] rounded-full flex items-center justify-center mx-auto mb-8">
          <Check size={36} className="text-white" strokeWidth={2.5} />
        </div>
        <p className="text-xs tracking-[0.4em] text-[#D97D93] uppercase mb-4">
          Pagamento Recebido
        </p>
        <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#7A4B52] mb-4">
          Obrigado pela sua compra!
        </h1>
        <p className="text-[#6E5A5D] text-sm leading-relaxed mb-8 flex items-center justify-center gap-2">
          <Gift size={16} className="text-[#D97D93]" />
          Seu pagamento foi processado com sucesso. Em breve voce recebera um
          e-mail com os detalhes do seu pedido.
        </p>

        <div className="bg-white border border-[#F2DCDD] rounded-[24px] p-6 text-left mb-8">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-xs text-[#6E5A5D] mb-1">Status</p>
              <p className="text-sm font-semibold text-[#3E8B5A]">
                Pagamento Confirmado
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6E5A5D] mb-1">Proximo Passo</p>
              <p className="text-sm font-semibold text-[#7A4B52]">
                Aguardando preparacao do pedido
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full h-12 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Package size={16} /> Continuar Comprando
          </Link>
          <p className="text-xs text-[#6E5A5D]">
            Para acompanhar seu pedido, entre em contato com nosso suporte.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
