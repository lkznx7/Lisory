"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function ContactPageContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Preencha nome, e-mail e mensagem.");
      return;
    }
    setSubmitting(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.lisory.com.br";
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Erro ao enviar mensagem.");
      }
      setSubmitted(true);
      toast.success("Mensagem enviada com sucesso!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

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
                icon: (
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.76a8.28 8.28 0 004.76 1.52V6.83a4.84 4.84 0 01-1-.14z"/>
                  </svg>
                ),
                label: "TikTok",
                value: "@lisory.acessorios",
                sub: "Vídeos e novidades",
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
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <CheckCircle className="size-10 text-[#3E8B5A]" />
                <p className="text-sm font-medium text-[#7A4B52]">Mensagem enviada!</p>
                <p className="text-xs text-[#6E5A5D]">Responderemos em até 24h.</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs text-[#D97D93] underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#7A4B52] mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    maxLength={150}
                    className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm text-[#7A4B52] placeholder-[#6E5A5D] outline-none focus:border-[#D97D93] bg-[#FFF9F8] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#7A4B52] mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    maxLength={255}
                    className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm text-[#7A4B52] placeholder-[#6E5A5D] outline-none focus:border-[#D97D93] bg-[#FFF9F8] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#7A4B52] mb-2">
                    Assunto
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Dúvida, troca, sugestão..."
                    maxLength={200}
                    className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm text-[#7A4B52] placeholder-[#6E5A5D] outline-none focus:border-[#D97D93] bg-[#FFF9F8] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#7A4B52] mb-2">
                    Mensagem
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escreva sua mensagem..."
                    maxLength={2000}
                    className="w-full px-4 py-3 border border-[#F2DCDD] rounded-xl text-sm text-[#7A4B52] placeholder-[#6E5A5D] outline-none focus:border-[#D97D93] bg-[#FFF9F8] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-[#D97D93] hover:bg-[#C8667F] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Send className="size-4" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
