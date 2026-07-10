import { Metadata } from "next";
import { CheckoutPageContent } from "./content";

export const metadata: Metadata = {
  title: "Finalizar Compra",
  description: "Complete sua compra na Lisory com segurança.",
};

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
