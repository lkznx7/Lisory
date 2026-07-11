"use client";

import { motion } from "motion/react";
import { Instagram } from "lucide-react";

const images = [
  "/images/instagram-1.jpg",
  "/images/instagram-2.jpg",
  "/images/instagram-3.jpg",
  "/images/instagram-4.jpg",
  "/images/instagram-5.jpg",
  "/images/instagram-6.jpg",
];

export function InstagramSection() {
  return (
    <section className="py-20 px-4 lg:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.4em] text-[#D97D93] uppercase mb-4">
          Siga-nos
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#7A4B52] mb-2">
          @uselisory
        </h2>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {images.map((id, i) => (
          <motion.div
            key={id}
            className="group relative aspect-square overflow-hidden rounded-[14px] bg-[#FCEEEF] cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <img
              src={id}
              alt="Instagram Lisory"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#7A4B52]/0 group-hover:bg-[#7A4B52]/30 transition-colors duration-200 flex items-center justify-center">
              <Instagram
                size={20}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
