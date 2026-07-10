import type { Metadata } from "next";
import TermsContent from "./content";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condicoes de uso da plataforma Lisory",
};

export default function Page() {
  return <TermsContent />;
}
