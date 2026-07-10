import { Suspense } from "react";
import { Metadata } from "next";
import { CategoryPageContent } from "./content";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Escolha seu Scoop Lisory. Experiencia surpresa com acessorios mix dourado e prata.",
};

export default function CategoryPage() {
  return (
    <Suspense>
      <CategoryPageContent />
    </Suspense>
  );
}
