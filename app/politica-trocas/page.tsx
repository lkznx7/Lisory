import type { Metadata } from "next";
import ExchangePolicyContent from "./content";

export const metadata: Metadata = {
  title: "Politica de Trocas",
  description: "Politica de trocas e garantias da Lisory",
};

export default function Page() {
  return <ExchangePolicyContent />;
}
