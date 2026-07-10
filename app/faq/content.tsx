"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const allFaqs = [
  { q: "O que é um Scoop?", a: "É uma caixa surpresa com uma seleção curada de joias. Cada Scoop tem um tema e quantidade de peças específica — você só descobre o conteúdo ao abrir." },
  { q: "Posso escolher as peças do meu Scoop?", a: "Não — a surpresa é a experiência! Nossa curadoria seleciona cada peça pensando no tema do Scoop e no seu perfil. Se preferir escolher, confira nossos produtos avulsos." },
  { q: "As joias são de qualidade?", a: "Sim! Todas as peças são em aço inoxidável 316L de grau cirúrgico, banhadas a ouro, resistentes à água e hipoalergênicas." },
  { q: "Qual o prazo de entrega?", a: "Enviamos para todo o Brasil. O prazo médio é de 3 a 7 dias úteis para as capitais e 5 a 10 dias úteis para demais regiões." },
  { q: "Qual a política de troca?", a: "Oferecemos 30 dias para troca ou devolução, sem necessidade de justificativa. Basta entrar em contato com nosso suporte." },
  { q: "Posso comprar mais de um Scoop?", a: "Sim! Cada Scoop é independente. Você pode comprar quantos quiser — inclusive modelos diferentes para presentear." },
  { q: "O Scoop vem em embalagem para presente?", a: "Sim! Todos os Scoops são enviados em uma caixa premium Lisory com lacre e detalhes especiais, perfeita para presentear." },
  { q: "Como cuidar das minhas joias?", a: "Apesar de serem resistentes, recomendamos limpeza suave com pano macio. Evite exposição direta a produtos químicos concentrados como alvejante." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-[16px] border border-[#F2DCDD] overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-6 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-semibold text-[#7A4B52] pr-4">{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-[#6E5A5D] flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-sm text-[#6E5A5D] leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqPageContent() {
  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8]">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.4em] text-[#D97D93] uppercase mb-4">
            Dúvidas
          </p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl font-light text-[#7A4B52]">
            Perguntas Frequentes
          </h1>
        </div>
        <div className="space-y-3">
          {allFaqs.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </main>
  );
}
