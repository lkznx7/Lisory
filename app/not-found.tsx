import Link from "next/link";

export default function NotFound() {
  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8] flex items-center justify-center px-4 lg:px-6">
      <div className="max-w-lg w-full text-center">
        <p className="font-['Cormorant_Garamond'] text-8xl font-light text-[#D97D93] mb-4">
          404
        </p>
        <h1 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52] mb-4">
          Página não encontrada
        </h1>
        <p className="text-[#6E5A5D] text-sm mb-10">
          A página que você procura não existe ou foi removida.
        </p>
        <Link
          href="/"
          className="h-12 px-8 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center"
        >
          Voltar ao Início
        </Link>
      </div>
    </main>
  );
}
