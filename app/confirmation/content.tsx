"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Check, Package, Gift, ExternalLink } from "lucide-react";

export function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const receiptUrl = searchParams.get("receipt_url");
  const captureMethod = searchParams.get("capture_method");

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
          Pedido Confirmado
        </p>
        <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#7A4B52] mb-4">
          Sua surpresa esta a caminho!
        </h1>
        <p className="text-[#6E5A5D] text-sm leading-relaxed mb-8 flex items-center justify-center gap-2">
          <Gift size={16} className="text-[#D97D93]" />
          Recebemos seu pedido e em breve voce recebera um e-mail com os detalhes
          e o codigo de rastreamento.
        </p>

        <div className="bg-white border border-[#F2DCDD] rounded-[24px] p-6 text-left mb-8">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Numero do Pedido", value: orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : "#LSR-2026-08421" },
              { label: "Pagamento", value: captureMethod ? `Pago via ${captureMethod.toUpperCase()}` : "Confirmado" },
              { label: "Entrega Estimada", value: "5 a 10 dias uteis" },
              { label: "Status", value: "Pagamento Confirmado" },
            ].map((row) => (
              <div key={row.label}>
                <p className="text-xs text-[#6E5A5D] mb-1">{row.label}</p>
                <p className="text-sm font-semibold text-[#7A4B52]">
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {receiptUrl && (
          <a
            href={receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#D97D93] hover:text-[#C8667F] mb-6 transition-colors"
          >
            <ExternalLink size={14} />
            Ver comprovante de pagamento
          </a>
        )}

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
