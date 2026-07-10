import { Metadata } from "next";
import { WishlistPageContent } from "./content";

export const metadata: Metadata = {
  title: "Lista de Desejos",
  description: "Seus Scoops favoritos Lisory em um só lugar.",
};

export default function WishlistPage() {
  return <WishlistPageContent />;
}
