"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function HorizontalBanner() {
  return (
    <section className="py-12 px-4 lg:px-6 max-w-7xl mx-auto">
      <motion.div
        className="relative rounded-[20px] overflow-hidden bg-gradient-to-r from-[#F8D8D3] to-[#FCEEEF] border border-[#F2DCDD] min-h-[180px] lg:min-h-[220px] flex items-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/images/scoop-2.jpg"
          alt="Lisory Scoop"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9F8]/85 via-[#FFF9F8]/40 to-[#FFF9F8]/85" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full px-8 lg:px-16 py-8 gap-6">
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-3">
              <Sparkles size={18} className="text-[#D97D93]" />
              <span className="text-xs tracking-[0.4em] uppercase text-[#D97D93] font-semibold">
                Lançamento
              </span>
            </div>
            <h3 className="font-['Cormorant_Garamond'] text-2xl lg:text-3xl font-light text-[#7A4B52]">
              Novo Scoop em Breve
            </h3>
            <p className="text-[#6E5A5D] text-sm mt-2">
              Fique ligada nos próximos lançamentos.
            </p>
          </div>
          <Link
            href="/category"
            className="h-11 px-6 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2 shrink-0"
          >
            <Sparkles size={16} /> Ver Scoops
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
