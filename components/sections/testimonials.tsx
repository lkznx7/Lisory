"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star } from "lucide-react";
import { testimonials } from "@/constants/data";

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 px-4 lg:px-6 bg-[#FCEEEF]">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs tracking-[0.4em] text-[#D97D93] uppercase mb-4">
          Depoimentos
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#7A4B52] mb-14">
          Quem já viveu a experiência
        </h2>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-[#FFF9F8] rounded-[24px] p-10 border border-[#F2DCDD]"
            >
              <div className="flex justify-center mb-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-[#D97D93] text-[#D97D93]"
                  />
                ))}
              </div>
              <p className="font-['Cormorant_Garamond'] text-2xl lg:text-3xl font-light text-[#7A4B52] italic leading-relaxed mb-8">
                &ldquo;{testimonials[activeIndex].text}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-[#7A4B52] text-sm">
                  {testimonials[activeIndex].name}
                </p>
                <p className="text-xs text-[#6E5A5D]">
                  {testimonials[activeIndex].location}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === activeIndex
                    ? "w-6 h-2 bg-[#D97D93]"
                    : "w-2 h-2 bg-[#F2DCDD]"
                }`}
                aria-label={`Ver depoimento ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
