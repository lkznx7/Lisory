import type { Metadata } from "next";
import RegisterPage from "./content";

export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Crie sua conta Lisory",
};

export default function Page() {
  return <RegisterPage />;
}
