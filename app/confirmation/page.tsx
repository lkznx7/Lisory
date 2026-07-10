import { Suspense } from "react";
import { Metadata } from "next";
import { ConfirmationPageContent } from "./content";

export const metadata: Metadata = {
  title: "Pedido Confirmado",
  description: "Seu Scoop Lisory foi confirmado com sucesso!",
};

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationPageContent />
    </Suspense>
  );
}
