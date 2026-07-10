"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Gift } from "lucide-react";
export function FlyerSection() {
  return (
    <section className="py-16 px-4 lg:px-6 max-w-7xl mx-auto">
      <motion.div
        className="relative rounded-[24px] overflow-hidden bg-gradient-to-br from-[#D97D93] to-[#C8667F] min-h-[300px] lg:min-h-[400px] flex items-center justify-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/images/banner-horizontal.jpeg"
          alt="Promoção Lisory Scoop"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#C8667F]/70 via-[#C8667F]/30 to-transparent" />

        <div className="relative z-10 text-center px-6 py-12">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Gift size={32} className="text-white" />
          </div>
          <h2 className="font-['Cormorant_Garamond'] text-3xl lg:text-5xl font-light text-white mb-4">
            Promoção Especial
          </h2>
          <p className="text-white/80 text-sm lg:text-base mb-8 max-w-md mx-auto">
            Oferta por tempo limitado. Garanta já o seu scoop!
          </p>
          <Link
            href="/category"
            className="inline-flex h-12 px-8 bg-white text-[#D97D93] hover:bg-[#FCEEEF] text-sm font-semibold tracking-wide rounded-xl transition-all duration-200 items-center gap-2"
          >
            <Gift size={16} /> Aproveitar Oferta
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
