import type { Metadata } from "next";
import PrivacyContent from "./content";

export const metadata: Metadata = {
  title: "Politica de Privacidade",
  description: "Como a Lisory coleta e utiliza seus dados",
};

export default function Page() {
  return <PrivacyContent />;
}
