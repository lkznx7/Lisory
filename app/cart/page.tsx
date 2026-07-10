import { Metadata } from "next";
import { CartPageContent } from "./content";

export const metadata: Metadata = {
  title: "Carrinho de Compras",
  description: "Revise os itens no seu carrinho de compras Lisory.",
};

export default function CartPage() {
  return <CartPageContent />;
}
