"use client";

import { motion } from "motion/react";

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.76a8.28 8.28 0 004.76 1.52V6.83a4.84 4.84 0 01-1-.14z"/>
    </svg>
  );
}

export function TikTokSection() {
  return (
    <section className="py-20 px-4 lg:px-6 max-w-7xl mx-auto">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] text-[#D97D93] uppercase mb-4">
          Siga-nos
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#7A4B52] mb-4">
          @lisory.acessorios
        </h2>
        <motion.a
          href="https://www.tiktok.com/@lisory.acessorios"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#7A4B52] text-white text-sm font-semibold rounded-xl hover:bg-[#6A3E45] transition-colors"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <TikTokIcon size={18} />
          Seguir no TikTok
        </motion.a>
      </div>
    </section>
  );
}
