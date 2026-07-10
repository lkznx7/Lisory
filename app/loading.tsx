export default function Loading() {
  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#D97D93] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#6E5A5D]">Carregando...</p>
      </div>
    </main>
  );
}
