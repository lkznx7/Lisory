import { Metadata } from "next";
import { FaqPageContent } from "./content";

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description: "Tire suas dúvidas sobre os Scoops Lisory, entregas, trocas e mais.",
};

export default function FaqPage() {
  return <FaqPageContent />;
}
