import Link from "next/link";
import { Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#7A4B52] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <p className="font-['Cormorant_Garamond'] text-2xl font-semibold tracking-[0.2em] mb-2">
              LISORY
            </p>
            <p className="text-[10px] tracking-[0.4em] text-[#F2DCDD] uppercase mb-5">
               É luxo? É Lisory!
            </p>
            <p className="text-sm text-[#F2DCDD] leading-relaxed mb-6">
              Acessórios surpresa selecionados especialmente para você. Aço inoxidável em cada scoop.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "https://instagram.com/uselisory" },
                { icon: Mail, href: "mailto:Lisoryacessorios@gmail.com" },
              ].map(({ icon: Icon, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  className="w-9 h-9 border border-white/20 rounded-full flex items-center justify-center text-[#F2DCDD] hover:text-[#D97D93] hover:border-[#D97D93] transition-colors"
                >
                  <Icon size={15} />
                </Link>
              ))}
            </div>
          </div>

          {[
            {
              title: "Scoops",
              links: [
                { name: "Primeira Surpresa", href: "/product/primeira-surpresa" },
                { name: "Brilho em Dobro", href: "/product/brilho-em-dobro" },
                { name: "Colecao de Sonhos", href: "/product/colecao-de-sonhos" },
                { name: "Experiencia Premium", href: "/product/experiencia-premium" },
                { name: "Todos os Produtos", href: "/category" },
              ],
            },
            {
              title: "Atendimento",
              links: [
                { name: "FAQ", href: "/faq" },
                { name: "Trocas e Devolucoes", href: "/politica-trocas" },
                { name: "Rastreamento", href: "/account" },
                { name: "Politica de Privacidade", href: "/privacidade" },
                { name: "Termos de Uso", href: "/termos" },
              ],
            },
            {
              title: "Empresa",
              links: [
                { name: "Sobre Nós", href: "/about" },
                { name: "Contato", href: "/contact" },
                { name: "FAQ", href: "/faq" },
                { name: "Trabalhe Conosco", href: "/contact" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold tracking-widest uppercase text-white mb-5">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#F2DCDD] hover:text-[#D97D93] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#F2DCDD]">
            © 2026 Lisory. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "PIX", "Boleto", "AmEx"].map((m) => (
              <span
                key={m}
                className="px-2.5 py-1 bg-white/10 rounded-[6px] text-[10px] text-[#F2DCDD]"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
