import { Metadata } from "next";
import { AccountPageContent } from "./content";

export const metadata: Metadata = {
  title: "Minha Conta",
  description: "Gerencie seus pedidos, endereços e dados pessoais na Lisory.",
};

export default function AccountPage() {
  return <AccountPageContent />;
}
