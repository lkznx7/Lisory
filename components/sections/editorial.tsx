"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Gem, Ribbon, Sparkles, Heart, Gift } from "lucide-react";

const features = [
  { icon: <Gem size={16} />, title: "Aço inoxidável", desc: "Peças que não escurecem e podem molhar" },
  { icon: <Ribbon size={16} />, title: "Curadoria exclusiva", desc: "Cada scoop é montado especialmente para você" },
  { icon: <Sparkles size={16} />, title: "Detalhes que encantam", desc: "Peças versáteis para todas as ocasiões" },
  { icon: <Heart size={16} />, title: "Feito para surpreender", desc: "Garantia de satisfação em cada scoop" },
];

export function EditorialSection() {
  return (
    <section className="py-24 px-4 lg:px-6 bg-[#FFF9F8]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[#FCEEEF]">
            <Image
              src="/images/flyer1.jpg"
              alt="Experiência Lisory"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-[#F8E6E8] rounded-[18px] p-5 shadow-md border border-[#F2DCDD] hidden lg:block">
            <p className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52]">
              +12.000
            </p>
            <p className="text-xs text-[#6E5A5D] mt-1">experiências realizadas</p>
          </div>
        </motion.div>
        <motion.div
          className="lg:pl-12"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs tracking-[0.4em] text-[#D97D93] uppercase mb-6">
            A Experiência
          </p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#7A4B52] leading-[1.2] mb-6">
            A emoção está
            <br />
            na <em>surpresa</em>.
          </h2>
          <p className="text-[#6E5A5D] leading-relaxed mb-8">
            Cada scoop Lisory é uma experiência única. Selecionamos acessórios em aço inoxidável 
            e gravamos um vídeo exclusivo da sua abertura. São peças versáteis, lindas e 
            surpreendentes — escolhidas com carinho para você.
          </p>
          <div className="space-y-4 mb-10">
            {features.map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="w-9 h-9 bg-[#FCEEEF] rounded-[10px] flex items-center justify-center text-[#D97D93] flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#7A4B52]">{item.title}</p>
                  <p className="text-xs text-[#6E5A5D]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/category"
            className="h-12 px-8 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold tracking-wide rounded-xl transition-all duration-200 inline-flex items-center gap-2"
          >
            <Gift size={16} /> Quero um Scoop
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
