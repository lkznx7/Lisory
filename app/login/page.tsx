import type { Metadata } from "next";
import LoginPage from "./content";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta Lisory",
};

export default function Page() {
  return <LoginPage />;
}
