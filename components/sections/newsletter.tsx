"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = () => {
    if (email) setSubscribed(true);
  };

  return (
    <section className="py-24 px-4 lg:px-6 bg-[#7A4B52]">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs tracking-[0.4em] text-[#D97D93] uppercase mb-6">
          Newsletter
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-4xl font-light text-white mb-4">
          Receba surpresas no seu e-mail.
        </h2>
        <p className="text-[#F2DCDD] text-sm mb-10 leading-relaxed">
          Lançamentos exclusivos, ofertas especiais e novidades dos scoops direto no seu e-mail.
        </p>
        {subscribed ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center gap-2 text-[#3E8B5A]"
          >
            <Check size={18} />
            <span className="text-sm font-medium">Obrigada! Você está na lista.</span>
          </motion.div>
        ) : (
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              className="flex-1 h-12 px-5 bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm rounded-xl outline-none focus:border-[#D97D93] transition-colors"
            />
            <button
              onClick={handleSubmit}
              className="h-12 px-7 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              Inscrever
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
