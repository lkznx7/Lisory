"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Gift,
  LogOut,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/constants";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/hooks/use-auth";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

const scoopLinks = [
  { name: "Primeira Surpresa", href: "/product/primeira-surpresa", desc: "4 acessorios" },
  { name: "Brilho em Dobro", href: "/product/brilho-em-dobro", desc: "6 acessorios" },
  { name: "Colecao de Sonhos", href: "/product/colecao-de-sonhos", desc: "9 acessorios" },
  { name: "Experiencia Premium", href: "/product/experiencia-premium", desc: "12 acessorios" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const { totalCount: cartCount } = useCart();
  const { items: wishlist } = useWishlist();
  const { user, isAdmin, logout, isLoading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#FFF9F8]/95 backdrop-blur-md shadow-sm border-b border-[#F2DCDD]"
            : "bg-[#FFF9F8]/80 backdrop-blur-sm"
        )}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Announcement bar */}
        <div className="bg-[#7A4B52] text-white text-center py-2 px-4 text-[10px] sm:text-[11px] tracking-widest font-light overflow-x-auto whitespace-nowrap scrollbar-none">
          TROCA GRATIS · EXPERIENCIA SCOOP
        </div>

        <div className="h-16 lg:h-[72px] max-w-7xl mx-auto px-4 lg:px-6">
          {/* Mobile Navbar */}
          <div className="lg:hidden h-full grid items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
            <div className="justify-self-start">
              <button
                onClick={() => setMobileOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FCEEEF] transition-colors duration-200"
                aria-label="Menu"
              >
                <Menu size={20} className="text-[#7A4B52]" />
              </button>
            </div>
            <div className="justify-self-center -mt-17">
              <Link href="/">
                <Image
                  src="/images/logo-horizontal.svg"
                  alt="Lisory"
                  width={180}
                  height={48}
                  className="h-50 w-auto"
                  priority
                />
              </Link>
            </div>
            <div className="justify-self-end">
              <Link
                href="/cart"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FCEEEF] transition-colors duration-200 relative"
                aria-label="Carrinho"
              >
                <ShoppingBag size={20} className="text-[#7A4B52]" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#D97D93] text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden lg:flex items-center justify-between h-full">
            {/* Logo - Left */}
            <Link
              href="/"
              className="flex items-center flex-shrink-0"
            >
              <Image
                src="/images/logoSvgNavbar.svg"
                alt="Lisory"
                width={120}
                height={36}
                className="h-10 lg:h-12 w-auto"
                priority
              />
            </Link>

            {/* Center Navigation */}
            <nav className="flex items-center justify-center flex-1 gap-1 mx-8">
              <Link
                href="/"
                className={cn(
                  "px-4 py-2 text-[13px] font-medium tracking-wide rounded-lg transition-all duration-200",
                  pathname === "/"
                    ? "text-[#D97D93] bg-[#FCEEEF]"
                    : "text-[#7A4B52] hover:text-[#D97D93] hover:bg-[#FCEEEF]/50"
                )}
              >
                Inicio
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setMegaMenu("scoops")}
                onMouseLeave={() => setMegaMenu(null)}
              >
                <button
                  className={cn(
                    "px-4 py-2 text-[13px] font-medium tracking-wide rounded-lg transition-all duration-200",
                    pathname.startsWith("/product/")
                      ? "text-[#D97D93] bg-[#FCEEEF]"
                      : "text-[#7A4B52] hover:text-[#D97D93] hover:bg-[#FCEEEF]/50"
                  )}
                >
                  Scoops
                </button>
                <AnimatePresence>
                  {megaMenu === "scoops" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[550px] bg-white rounded-xl shadow-xl border border-[#F2DCDD] p-6"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        {scoopLinks.map((scoop) => (
                          <Link
                            key={scoop.name}
                            href={scoop.href}
                            className="group flex items-center gap-4 p-3 rounded-xl hover:bg-[#FCEEEF] transition-colors"
                          >
                            <div className="w-10 h-10 bg-[#F8D8D3] rounded-xl flex items-center justify-center text-[#D97D93] flex-shrink-0">
                              <Gift size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#7A4B52] group-hover:text-[#D97D93] transition-colors">
                                {scoop.name}
                              </p>
                              <p className="text-xs text-[#6E5A5D]">{scoop.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#F2DCDD] text-center">
                        <Link
                          href="/category"
                          className="text-sm text-[#D97D93] hover:text-[#C8667F] font-medium transition-colors"
                        >
                          Ver todos os Produtos →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                href="/category?category=pulseiras"
                className={cn(
                  "px-4 py-2 text-[13px] font-medium tracking-wide rounded-lg transition-all duration-200",
                  pathname === "/category" && categorySlug === "pulseiras"
                    ? "text-[#D97D93] bg-[#FCEEEF]"
                    : "text-[#7A4B52] hover:text-[#D97D93] hover:bg-[#FCEEEF]/50"
                )}
              >
                Pulseiras
              </Link>
              <Link
                href="/category?category=colares"
                className={cn(
                  "px-4 py-2 text-[13px] font-medium tracking-wide rounded-lg transition-all duration-200",
                  pathname === "/category" && categorySlug === "colares"
                    ? "text-[#D97D93] bg-[#FCEEEF]"
                    : "text-[#7A4B52] hover:text-[#D97D93] hover:bg-[#FCEEEF]/50"
                )}
              >
                Colares
              </Link>
              <Link
                href="/category"
                className={cn(
                  "px-4 py-2 text-[13px] font-medium tracking-wide rounded-lg transition-all duration-200",
                  pathname === "/category" && !categorySlug
                    ? "text-[#D97D93] bg-[#FCEEEF]"
                    : "text-[#7A4B52] hover:text-[#D97D93] hover:bg-[#FCEEEF]/50"
                )}
              >
                Todos
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FCEEEF] transition-colors duration-200"
                aria-label="Buscar"
              >
                <Search size={18} className="text-[#7A4B52]" />
              </button>
              <Link
                href="/wishlist"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FCEEEF] transition-colors duration-200 relative"
                aria-label="Favoritos"
              >
                <Heart size={18} className="text-[#7A4B52]" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#D97D93] text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              {!isLoading && (
                <div className="flex items-center gap-1">
                  {user ? (
                    <>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FCEEEF] transition-colors duration-200"
                          aria-label="Admin"
                        >
                          <Shield size={18} className="text-[#7A4B52]" />
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FCEEEF] transition-colors duration-200"
                        aria-label="Sair"
                      >
                        <LogOut size={18} className="text-[#7A4B52]" />
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FCEEEF] transition-colors duration-200"
                      aria-label="Entrar"
                    >
                      <User size={18} className="text-[#7A4B52]" />
                    </Link>
                  )}
                </div>
              )}
              <Link
                href="/cart"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FCEEEF] transition-colors duration-200 relative"
                aria-label="Carrinho"
              >
                <ShoppingBag size={18} className="text-[#7A4B52]" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#D97D93] text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar - Mobile: always visible */}
        <div className="lg:hidden border-t border-[#F2DCDD]">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3 bg-white border border-[#F2DCDD] rounded-xl px-4 h-11">
              <Search size={16} className="text-[#6E5A5D] flex-shrink-0" />
              <input
                className="flex-1 bg-transparent text-sm text-[#7A4B52] placeholder-[#6E5A5D] outline-none"
                placeholder="Pesquisar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(`/category?search=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchQuery("");
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Search bar - Desktop: toggled */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block overflow-hidden border-t border-[#F2DCDD]"
            >
              <div className="max-w-2xl mx-auto px-4 lg:px-6 py-4">
                <div className="flex items-center gap-3 bg-white border border-[#F2DCDD] rounded-xl px-4 h-12">
                  <Search size={16} className="text-[#6E5A5D] flex-shrink-0" />
                  <input
                    autoFocus
                    className="flex-1 bg-transparent text-sm text-[#7A4B52] placeholder-[#6E5A5D] outline-none"
                    placeholder="Pesquisar scoops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        router.push(`/category?search=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }
                    }}
                  />
                  <button onClick={() => setSearchOpen(false)} aria-label="Fechar busca">
                    <X size={16} className="text-[#6E5A5D] hover:text-[#7A4B52]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Drawer */}
      <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerContent className="bg-[#FFF9F8]">
          <DrawerHeader className="border-b border-[#F2DCDD]">
            <DrawerTitle className="font-['Cormorant_Garamond'] text-xl font-semibold tracking-[0.2em] text-center text-[#7A4B52]">
              {SITE.name}
            </DrawerTitle>
          </DrawerHeader>
          <nav className="flex-1 overflow-y-auto p-6 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center py-3.5 px-4 text-[14px] font-medium text-[#7A4B52] hover:bg-[#FCEEEF] rounded-xl transition-colors"
            >
              Inicio
            </Link>
            <p className="text-xs tracking-widest uppercase text-[#6E5A5D] px-4 pt-4 pb-2 font-semibold">
              Scoops
            </p>
            {scoopLinks.map((scoop) => (
              <Link
                key={scoop.name}
                href={scoop.href}
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center gap-3 py-3.5 px-4 text-[14px] font-medium text-[#7A4B52] hover:bg-[#FCEEEF] rounded-xl transition-colors"
              >
                <Gift size={16} className="text-[#C98A96]" />
                {scoop.name}
              </Link>
            ))}
            <Link
              href="/category?category=pulseiras"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center py-3.5 px-4 text-[14px] font-medium text-[#7A4B52] hover:bg-[#FCEEEF] rounded-xl transition-colors"
            >
              Pulseiras
            </Link>
            <Link
              href="/category?category=colares"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center py-3.5 px-4 text-[14px] font-medium text-[#7A4B52] hover:bg-[#FCEEEF] rounded-xl transition-colors"
            >
              Colares
            </Link>
            <Link
              href="/category"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center py-3.5 px-4 text-[14px] font-medium text-[#7A4B52] hover:bg-[#FCEEEF] rounded-xl transition-colors"
            >
              Todos os Produtos
            </Link>
          </nav>
          <div className="p-6 border-t border-[#F2DCDD] space-y-3">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center gap-3 py-3 px-4 text-sm text-[#6E5A5D] hover:bg-[#FCEEEF] rounded-xl transition-colors"
                  >
                    <Shield size={16} /> Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 py-3 px-4 text-sm text-[#6E5A5D] hover:bg-[#FCEEEF] rounded-xl transition-colors"
                >
                  <LogOut size={16} /> Sair
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center gap-3 py-3 px-4 text-sm text-[#6E5A5D] hover:bg-[#FCEEEF] rounded-xl transition-colors"
              >
                <User size={16} /> Entrar
              </Link>
            )}
            <Link
              href="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center gap-3 py-3 px-4 text-sm text-[#6E5A5D] hover:bg-[#FCEEEF] rounded-xl transition-colors"
            >
              <Heart size={16} /> Lista de Desejos
            </Link>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
