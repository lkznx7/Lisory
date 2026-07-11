import Link from "next/link";

export function AboutPageContent() {
  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <p className="text-xs tracking-[0.4em] text-[#D97D93] uppercase mb-6">
              Nossa História
            </p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl lg:text-6xl font-light text-[#7A4B52] leading-[1.1] mb-8">
              A surpresa que
              <br />
              <em>transforma</em> o presente.
            </h1>
            <p className="text-[#6E5A5D] leading-relaxed mb-6">
              A Lisory reinventou a arte de presentear. Cada Scoop é uma seleção
              surpresa criada para entregar emoção, beleza e um toque de
              sofisticação em cada detalhe.
            </p>
            <p className="text-[#6E5A5D] leading-relaxed">
              Curadoria feita com carinho, embalagem premium e a certeza de que
              a melhor joia é aquela que você não espera.
            </p>
          </div>
          <div className="relative aspect-square rounded-[24px] overflow-hidden bg-[#FCEEEF]">
            <img
              src="/images/scoop-1.jpg"
               alt="Lisory"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { value: "+12.000", label: "Clientes surpreendidas" },
            { value: "5★", label: "Avaliação média" },
            { value: "100%", label: "Curadoria premium" },
            { value: "Vitalícia", label: "Garantia" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-[#F2DCDD] rounded-[18px] p-6 text-center"
            >
              <p className="font-['Cormorant_Garamond'] text-4xl font-light text-[#D97D93] mb-2">
                {stat.value}
              </p>
              <p className="text-xs text-[#6E5A5D] uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[#7A4B52] rounded-[24px] p-12 lg:p-16 text-center">
          <p className="text-xs tracking-[0.4em] text-[#F8D8D3] uppercase mb-6">
            Nossa Missão
          </p>
          <p className="font-['Cormorant_Garamond'] text-3xl lg:text-5xl font-light text-white leading-relaxed max-w-3xl mx-auto">
            &ldquo;Criar momentos de surpresa e encantamento — uma caixa, uma
            história, uma experiência inesquecível.&rdquo;
          </p>
        </div>
      </div>
    </main>
  );
}
