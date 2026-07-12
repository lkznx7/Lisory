"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

export function PaymentReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [message, setMessage] = useState("Confirmando seu pagamento...");

  useEffect(() => {
    if (!orderId) {
      setMessage("Não foi possível localizar seu pedido.");
      return;
    }

    let cancelled = false;
    const checkPayment = async () => {
      try {
        const order = await api.get<{ status: string }>(`/orders/public/${orderId}`);
        if (cancelled) return;
        if (order.status === "PAGO") {
          router.replace(`/confirmation?orderId=${encodeURIComponent(orderId)}`);
          return;
        }
        setMessage("Pagamento ainda não confirmado. Esta página será atualizada automaticamente.");
      } catch {
        if (!cancelled) setMessage("Não foi possível consultar seu pagamento. Tente novamente em instantes.");
      }
    };

    void checkPayment();
    const interval = window.setInterval(checkPayment, 5000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, [orderId, router]);

  return <main className="min-h-screen flex items-center justify-center p-6 text-center text-[#6E5A5D]">{message}</main>;
}
