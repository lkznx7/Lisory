"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8] flex items-center justify-center px-4 lg:px-6">
      <div className="max-w-lg w-full text-center">
        <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#7A4B52] mb-4">
          Algo deu errado
        </h1>
        <p className="text-[#6E5A5D] text-sm mb-10">
          Ocorreu um erro inesperado. Tente novamente.
        </p>
        <button
          onClick={reset}
          className="h-12 px-8 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </main>
  );
}
