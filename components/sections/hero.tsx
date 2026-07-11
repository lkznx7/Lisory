"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Gift, ChevronRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-[88px] lg:pt-[96px]">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Lisory Scoop"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9F8]/95 via-[#FFF9F8]/70 to-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 lg:px-12 py-24">
        <motion.div
          className="max-w-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-xs tracking-[0.4em] text-[#D97D93] uppercase mb-6">
            é luxo? é lisory!
          </p>
          <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl lg:text-7xl font-light text-[#7A4B52] leading-[1.1] mb-6">
            Lisory
          </h1>
          <p className="text-[#6E5A5D] text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-10 max-w-md">
            Abra seu Scoop e descubra acessórios em aço inoxidável escolhidos para tornar seu momento ainda mais especial.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/category"
              className="h-12 px-8 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold tracking-wide rounded-xl transition-all duration-200 shadow-sm inline-flex items-center gap-2"
            >
              <Gift size={16} />
              Escolher Meu Scoop
            </Link>
            <Link
              href="#scoops"
              className="h-12 px-8 border border-[#D97D93] text-[#D97D93] hover:bg-[#D97D93] hover:text-white text-sm font-semibold tracking-wide rounded-xl transition-all duration-200 inline-flex items-center gap-2"
            >
              Saiba Mais <ChevronRight size={16} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-5 mt-12 pt-10 border-t border-[#F2DCDD]">
            {["💎 Aço inoxidável", "🎀 Curadoria exclusiva", "✨ Detalhes que encantam", "🤍 Feito para surpreender"].map(
              (seal) => (
                <div key={seal} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#D97D93] rounded-full flex items-center justify-center flex-shrink-0">
                  </div>
                  <span className="text-xs text-[#6E5A5D]">{seal}</span>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
