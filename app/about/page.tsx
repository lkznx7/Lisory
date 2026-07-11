import { Metadata } from "next";
import { AboutPageContent } from "./content";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description: "Conheça a história da Lisory, nossa missão e nossos valores.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
