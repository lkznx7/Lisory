import { Droplets, Sparkles, Video, Truck } from "lucide-react";

const items = [
  { icon: Droplets, text: "Pode molhar sem preocupação" },
  { icon: Sparkles, text: "Não escurece com o uso" },
  { icon: Video, text: "Vídeo exclusivo" },
  { icon: Truck, text: "Envio para todo o Brasil" },
];

export function TrustStrip() {
  return (
    <section className="bg-[#7A4B52] py-5">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-wrap items-center justify-center gap-8 lg:gap-16">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-white">
            <span className="text-[#D97D93]">
              <Icon size={16} />
            </span>
            <span className="text-[11px] tracking-widest uppercase">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
