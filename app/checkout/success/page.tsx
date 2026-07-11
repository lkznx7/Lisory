import { Suspense } from "react";
import { Metadata } from "next";
import { CheckoutSuccessContent } from "./content";

export const metadata: Metadata = {
  title: "Pagamento Realizado",
  description: "Seu pagamento foi processado com sucesso!",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
