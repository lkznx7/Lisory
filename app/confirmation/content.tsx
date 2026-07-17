"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Check, Package, Gift, Clock, AlertCircle, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface OrderData {
  id: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  shippingCarrier?: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PAGO: { label: "Pagamento Confirmado", icon: <Check size={36} className="text-white" strokeWidth={2.5} />, color: "#3E8B5A" },
  PENDING_PAYMENT: { label: "Aguardando Pagamento", icon: <Clock size={36} className="text-white" strokeWidth={2.5} />, color: "#D4A843" },
  PROCESSANDO: { label: "Processando", icon: <Clock size={36} className="text-white" strokeWidth={2.5} />, color: "#4A90D9" },
  CANCELADO: { label: "Cancelado", icon: <AlertCircle size={36} className="text-white" strokeWidth={2.5} />, color: "#C0392B" },
};

export function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Pedido nao encontrado");
      setLoading(false);
      return;
    }

    api.get<OrderData>(`/orders/public/${orderId}`)
      .then((data) => setOrder(data))
      .catch(() => setError("Erro ao carregar pedido"))
      .finally(() => setLoading(false));
  }, [orderId]);

  const orderIdShort = order ? order.id.slice(0, 8).toUpperCase() : "";

  let whatsappMsg = "";
  if (order?.shippingCarrier === "Retirada no Local") {
    whatsappMsg = `Olá! Meu pagamento foi aprovado e escolhi a opção Retirada no Local. Gostaria de combinar o dia e o horário para retirada. Meu pedido é o nº ${orderIdShort}.`;
  } else if (order?.shippingCarrier === "Uber Flash") {
    whatsappMsg = `Olá! Meu pagamento foi aprovado e escolhi a opção Uber Flash. Gostaria de combinar o envio do meu pedido. Meu pedido é o nº ${orderIdShort}.`;
  }

  useEffect(() => {
    if (order && order.status === "PAGO" && (order.shippingCarrier === "Retirada no Local" || order.shippingCarrier === "Uber Flash")) {
      window.location.href = `https://wa.me/5561983504415?text=${encodeURIComponent(whatsappMsg)}`;
    }
  }, [order, whatsappMsg]);

  const statusInfo = order ? STATUS_LABELS[order.status] || STATUS_LABELS.PENDING_PAYMENT : null;
  const isPaid = order?.status === "PAGO";

  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8] flex items-center justify-center px-4 lg:px-6">
      <motion.div
        className="max-w-lg w-full text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? (
          <div className="py-12">
            <div className="w-12 h-12 border-4 border-[#D97D93] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#6E5A5D] text-sm">Carregando pedido...</p>
          </div>
        ) : error ? (
          <>
            <div className="w-20 h-20 bg-[#C0392B] rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle size={36} className="text-white" strokeWidth={2.5} />
            </div>
            <p className="text-xs tracking-[0.4em] text-[#C0392B] uppercase mb-4">Erro</p>
            <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#7A4B52] mb-4">{error}</h1>
            <Link href="/" className="inline-block h-12 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors px-8 items-center justify-center">
              Voltar para a loja
            </Link>
          </>
        ) : order && statusInfo ? (
          <>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: statusInfo.color }}>
              {statusInfo.icon}
            </div>
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: statusInfo.color }}>
              {statusInfo.label}
            </p>
            {(order.shippingCarrier === "Retirada no Local" || order.shippingCarrier === "Uber Flash") ? (
              <>
                <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#7A4B52] mb-4">
                  {order.shippingCarrier === "Retirada no Local" ? "Seu pedido foi recebido!" : "Seu envio está sendo preparado!"}
                </h1>
                <div className="text-[#6E5A5D] text-sm leading-relaxed mb-8 space-y-4">
                  <p>
                    {order.shippingCarrier === "Retirada no Local"
                      ? "Para combinar o dia e horário da retirada, entre em contato pelo WhatsApp:"
                      : "Para combinar o envio do seu pedido via Uber Flash, entre em contato pelo WhatsApp:"}
                  </p>
                  <p className="font-bold text-lg text-[#7A4B52]">(61) 98350-4415</p>
                  <p>
                    {order.shippingCarrier === "Retirada no Local"
                      ? "Nossa equipe combinará o melhor horário para retirada do pedido."
                      : "Nossa equipe combinará os detalhes de envio do seu pedido."}
                  </p>
                  <div className="flex justify-center pt-2">
                    <a
                      href={`https://wa.me/5561983504415?text=${encodeURIComponent(whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 h-12 bg-[#25D366] hover:bg-[#20BA5C] text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      <MessageCircle size={18} />
                      Falar no WhatsApp
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#7A4B52] mb-4">
                  {isPaid ? "Sua surpresa esta a caminho!" : "Aguardando confirmacao de pagamento"}
                </h1>
                <p className="text-[#6E5A5D] text-sm leading-relaxed mb-8 flex items-center justify-center gap-2">
                  <Gift size={16} className="text-[#D97D93]" />
                  {isPaid
                    ? "Recebemos seu pedido e em breve voce recebera um e-mail com os detalhes e o codigo de rastreamento."
                    : "Seu pedido foi registrado. Assim que o pagamento for confirmado, voce recebera um e-mail com os detalhes."}
                </p>
              </>
            )}

            <div className="bg-white border border-[#F2DCDD] rounded-[24px] p-6 text-left mb-8">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Numero do Pedido", value: `#${orderId!.slice(0, 8).toUpperCase()}` },
                  { label: "Pagamento", value: order.paymentMethod === "PAGAR_NA_RETIRADA" ? "Na Retirada" : isPaid ? "Confirmado" : "Aguardando" },
                  { label: "Total", value: `R$ ${order.total.toFixed(2).replace(".", ",")}` },
                  { label: "Status", value: statusInfo.label },
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
          </>
        ) : null}
      </motion.div>
    </main>
  );
}
