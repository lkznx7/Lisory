import { Metadata } from "next";
import { ContactPageContent } from "./content";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com a Lisory Scoop Experience. Estamos aqui para ajudar!",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
