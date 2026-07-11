"use client";

import { Mail, Instagram } from "lucide-react";

export function ContactPageContent() {
  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8]">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] text-[#D97D93] uppercase mb-4">
            Fale Conosco
          </p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl font-light text-[#7A4B52]">
            Estamos aqui para você
          </h1>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[

              {
                icon: <Mail size={20} />,
                label: "E-mail",
                value: "Lisoryacessorios@gmail.com",
                sub: "Resposta em até 24h",
              },
              {
                icon: <Instagram size={20} />,
                label: "Instagram",
                value: "@uselisory",
                sub: "DM sempre aberto",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex gap-4 bg-white border border-[#F2DCDD] rounded-[18px] p-5"
              >
                <div className="w-10 h-10 bg-[#FCEEEF] rounded-xl flex items-center justify-center text-[#D97D93] flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-[#6E5A5D] uppercase tracking-wide mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-[#7A4B52]">
                    {item.value}
                  </p>
                  <p className="text-xs text-[#6E5A5D]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#F2DCDD] rounded-[24px] p-8 space-y-5">
            <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#7A4B52]">
              Envie uma mensagem
            </h3>
            {[
              { label: "Nome", placeholder: "Seu nome" },
              { label: "E-mail", placeholder: "seu@email.com", type: "email" },
              {
                label: "Assunto",
                placeholder: "Dúvida, troca, sugestão...",
              },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-[#7A4B52] mb-2">
                  {f.label}
                </label>
                <input
                  type={f.type || "text"}
                  placeholder={f.placeholder}
                  className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm text-[#7A4B52] placeholder-[#6E5A5D] outline-none focus:border-[#D97D93] bg-[#FFF9F8] transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-[#7A4B52] mb-2">
                Mensagem
              </label>
              <textarea
                rows={4}
                placeholder="Escreva sua mensagem..."
                className="w-full px-4 py-3 border border-[#F2DCDD] rounded-xl text-sm text-[#7A4B52] placeholder-[#6E5A5D] outline-none focus:border-[#D97D93] bg-[#FFF9F8] transition-colors resize-none"
              />
            </div>
            <button className="w-full h-12 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors">
              Enviar Mensagem
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
