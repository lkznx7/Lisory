import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Star,
  Check,
  Truck,
  Shield,
  RefreshCw,
  Instagram,
  Plus,
  Minus,
  Trash2,
  User,
  MapPin,
  CreditCard,
  Package,
  LogOut,
  Eye,
  Share2,
  Copy,
  Phone,
  Mail,
  MessageCircle,
  Zap,
  Award,
  Clock,
  ChevronUp,
  SlidersHorizontal,
  Grid3X3,
  List,
  Tag,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Page =
  | "home"
  | "category"
  | "product"
  | "cart"
  | "checkout"
  | "confirmation"
  | "account"
  | "wishlist"
  | "about"
  | "contact"
  | "faq";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const products: Product[] = [
  {
    id: "1",
    name: "Colar Lua Crescente",
    price: 189,
    originalPrice: 249,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=700&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=700&fit=crop&auto=format",
    badge: "Mais Vendido",
    category: "Colares",
    rating: 4.9,
    reviews: 342,
    isBestseller: true,
  },
  {
    id: "2",
    name: "Anel Infinito Pavê",
    price: 149,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=700&fit=crop&auto=format",
    badge: "Novo",
    category: "Anéis",
    rating: 4.8,
    reviews: 187,
    isNew: true,
  },
  {
    id: "3",
    name: "Pulseira Elos Dourados",
    price: 219,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=700&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1573408301185-9519bf4f8d6b?w=600&h=700&fit=crop&auto=format",
    badge: "Edição Limitada",
    category: "Pulseiras",
    rating: 4.7,
    reviews: 94,
  },
  {
    id: "4",
    name: "Brinco Gota de Cristal",
    price: 129,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&h=700&fit=crop&auto=format",
    category: "Brincos",
    rating: 4.9,
    reviews: 261,
    isBestseller: true,
  },
  {
    id: "5",
    name: "Colar Corrente Veneziana",
    price: 169,
    originalPrice: 199,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=700&fit=crop&auto=format",
    badge: "Sale",
    category: "Colares",
    rating: 4.6,
    reviews: 128,
  },
  {
    id: "6",
    name: "Anel Solitário Zircônia",
    price: 199,
    image: "https://images.unsplash.com/photo-1573408301185-9519bf4f8d6b?w=600&h=700&fit=crop&auto=format",
    badge: "Novo",
    category: "Anéis",
    rating: 4.8,
    reviews: 73,
    isNew: true,
  },
  {
    id: "7",
    name: "Pulseira Charm Delicada",
    price: 159,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=700&fit=crop&auto=format",
    category: "Pulseiras",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "8",
    name: "Brinco Argola Texturizada",
    price: 109,
    image: "https://images.unsplash.com/photo-1583937443686-3ff98e736696?w=600&h=700&fit=crop&auto=format",
    category: "Brincos",
    rating: 4.5,
    reviews: 89,
  },
];

const categories = [
  { name: "Colares", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop&auto=format", count: 48 },
  { name: "Pulseiras", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop&auto=format", count: 36 },
  { name: "Anéis", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop&auto=format", count: 52 },
  { name: "Brincos", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&h=500&fit=crop&auto=format", count: 44 },
  { name: "Conjuntos", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop&auto=format", count: 22 },
];

const testimonials = [
  { name: "Ana Beatriz M.", text: "Comprei o colar lua crescente e me apaixonei. Já recebi tantos elogios! A qualidade é impressionante para o preço.", rating: 5, location: "São Paulo, SP" },
  { name: "Camila R.", text: "As joias são lindas e resistentes. Uso na praia, academia, em todo lugar e nunca escurecem. Marca incrível.", rating: 5, location: "Rio de Janeiro, RJ" },
  { name: "Fernanda L.", text: "Entrega rápida, embalagem sofisticada e a peça é ainda mais bonita pessoalmente. Recomendo demais!", rating: 5, location: "Belo Horizonte, MG" },
];

const faqItems = [
  { q: "As joias escurecem com o tempo?", a: "Não. Nossas joias são feitas em aço inoxidável 316L de grau cirúrgico, que mantém o brilho permanentemente, mesmo com contato com água, suor e perfumes." },
  { q: "Posso usar no banho e na praia?", a: "Sim! Nossas peças são 100% resistentes à água. Você pode usar no mar, piscina, banho e academia sem preocupação." },
  { q: "As joias são hipoalergênicas?", a: "Absolutamente. O aço inoxidável 316L é o mesmo utilizado em implantes médicos, sendo completamente seguro para peles sensíveis." },
  { q: "Qual o prazo de entrega?", a: "Enviamos para todo o Brasil. O prazo médio é de 3 a 7 dias úteis para as capitais e 5 a 10 dias úteis para demais regiões." },
  { q: "Qual a política de troca?", a: "Oferecemos 30 dias para troca ou devolução, sem necessidade de justificativa. Basta entrar em contato com nosso suporte." },
];

// ─── Shared Components ────────────────────────────────────────────────────────

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "rose" | "champagne" | "outline" }) {
  const styles = {
    default: "bg-[#2D2D2D] text-white",
    rose: "bg-[#C98F8A] text-white",
    champagne: "bg-[#E9D7C7] text-[#2D2D2D]",
    outline: "border border-[#ECE7E2] text-[#6E6A66] bg-transparent",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full ${styles[variant]}`}>
      {children}
    </span>
  );
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={12} className={i <= Math.round(rating) ? "fill-[#C98F8A] text-[#C98F8A]" : "fill-[#ECE7E2] text-[#ECE7E2]"} />
        ))}
      </div>
      <span className="text-xs text-[#6E6A66]">({count})</span>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({
  onNavigate,
  cartCount,
  onCartOpen,
  wishlistCount,
  currentPage,
}: {
  onNavigate: (p: Page) => void;
  cartCount: number;
  onCartOpen: () => void;
  wishlistCount: number;
  currentPage: Page;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Novidades", page: "category" as Page },
    { label: "Colares", page: "category" as Page },
    { label: "Pulseiras", page: "category" as Page },
    { label: "Anéis", page: "category" as Page },
    { label: "Brincos", page: "category" as Page },
    { label: "Sobre", page: "about" as Page },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#FDFBF8]/95 backdrop-blur-md shadow-sm border-b border-[#ECE7E2]" : "bg-[#FDFBF8]/80 backdrop-blur-sm"}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Announcement bar */}
        <div className="bg-[#2D2D2D] text-white text-center py-2 px-4 text-[11px] tracking-widest font-light">
          FRETE GRÁTIS ACIMA DE R$199 · TROCA GRÁTIS · PARCELE EM ATÉ 12×
        </div>

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Left nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.slice(0, 3).map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.page)}
                className="text-[13px] font-medium text-[#2D2D2D] tracking-wide hover:text-[#C98F8A] transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
          >
            <span className="font-['Cormorant_Garamond'] text-2xl font-semibold tracking-[0.2em] text-[#2D2D2D]">
              LISORY
            </span>
            <span className="text-[8px] tracking-[0.4em] text-[#6E6A66] uppercase -mt-0.5">
              Fine Jewelry
            </span>
          </button>

          {/* Right nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.slice(3).map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.page)}
                className="text-[13px] font-medium text-[#2D2D2D] tracking-wide hover:text-[#C98F8A] transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5EFE9] transition-colors duration-200"
            >
              <Search size={18} className="text-[#2D2D2D]" />
            </button>
            <button
              onClick={() => onNavigate("account")}
              className="hidden lg:flex w-9 h-9 items-center justify-center rounded-full hover:bg-[#F5EFE9] transition-colors duration-200"
            >
              <User size={18} className="text-[#2D2D2D]" />
            </button>
            <button
              onClick={() => onNavigate("wishlist")}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5EFE9] transition-colors duration-200 relative"
            >
              <Heart size={18} className="text-[#2D2D2D]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C98F8A] text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={onCartOpen}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5EFE9] transition-colors duration-200 relative"
            >
              <ShoppingBag size={18} className="text-[#2D2D2D]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C98F8A] text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5EFE9] transition-colors duration-200"
            >
              <Menu size={18} className="text-[#2D2D2D]" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-[#ECE7E2]"
            >
              <div className="max-w-2xl mx-auto px-6 py-4">
                <div className="flex items-center gap-3 bg-white border border-[#ECE7E2] rounded-[12px] px-4 h-12">
                  <Search size={16} className="text-[#6E6A66] flex-shrink-0" />
                  <input
                    autoFocus
                    className="flex-1 bg-transparent text-sm text-[#2D2D2D] placeholder-[#6E6A66] outline-none"
                    placeholder="Pesquisar joias..."
                  />
                  <button onClick={() => setSearchOpen(false)}>
                    <X size={16} className="text-[#6E6A66] hover:text-[#2D2D2D]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[#FDFBF8] z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#ECE7E2]">
                <span className="font-['Cormorant_Garamond'] text-xl font-semibold tracking-[0.2em]">LISORY</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={20} className="text-[#2D2D2D]" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-6 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
                    className="w-full text-left py-3.5 px-4 text-[14px] font-medium text-[#2D2D2D] hover:bg-[#F5EFE9] rounded-[12px] transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
              <div className="p-6 border-t border-[#ECE7E2] space-y-3">
                <button
                  onClick={() => { onNavigate("account"); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 py-3 px-4 text-sm text-[#6E6A66] hover:bg-[#F5EFE9] rounded-[12px] transition-colors"
                >
                  <User size={16} /> Minha Conta
                </button>
                <button
                  onClick={() => { onNavigate("wishlist"); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 py-3 px-4 text-sm text-[#6E6A66] hover:bg-[#F5EFE9] rounded-[12px] transition-colors"
                >
                  <Heart size={16} /> Lista de Desejos
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Mini Cart ────────────────────────────────────────────────────────────────
function MiniCart({
  open,
  onClose,
  cart,
  onRemove,
  onQtyChange,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
  onNavigate: (p: Page) => void;
}) {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const freeShippingThreshold = 199;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#FDFBF8] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#ECE7E2]">
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#2D2D2D]">
                  Seu Carrinho
                </h2>
                <p className="text-xs text-[#6E6A66]">{cart.length} {cart.length === 1 ? "item" : "itens"}</p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5EFE9] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free shipping bar */}
            {subtotal < freeShippingThreshold && (
              <div className="px-6 py-3 bg-[#F5EFE9]">
                <p className="text-xs text-[#6E6A66] mb-2">
                  Faltam <strong className="text-[#C98F8A]">R${(freeShippingThreshold - subtotal).toFixed(2)}</strong> para frete grátis
                </p>
                <div className="h-1 bg-[#ECE7E2] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#C98F8A] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
            {subtotal >= freeShippingThreshold && (
              <div className="px-6 py-3 bg-[#E9D7C7]/50 flex items-center gap-2">
                <Check size={14} className="text-[#3E8B5A]" />
                <p className="text-xs text-[#3E8B5A] font-medium">Você ganhou frete grátis!</p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-4">
                  <ShoppingBag size={40} className="text-[#ECE7E2]" />
                  <p className="text-sm text-[#6E6A66]">Seu carrinho está vazio</p>
                  <button
                    onClick={() => { onNavigate("category"); onClose(); }}
                    className="text-sm text-[#C98F8A] underline underline-offset-2"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="flex gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-[14px] bg-[#F5EFE9]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2D2D2D] leading-tight">{item.name}</p>
                      <p className="text-[#C98F8A] font-semibold mt-1">R${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-[#ECE7E2] rounded-[10px] overflow-hidden">
                          <button
                            onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#F5EFE9] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm">{item.qty}</span>
                          <button
                            onClick={() => onQtyChange(item.id, item.qty + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#F5EFE9] transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-[#6E6A66] hover:text-[#D64F4F] transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#ECE7E2] space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6E6A66]">Subtotal</span>
                    <span className="font-medium">R${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6E6A66]">Frete</span>
                    <span className="text-[#3E8B5A] font-medium">{subtotal >= 199 ? "Grátis" : "A calcular"}</span>
                  </div>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-[#C98F8A] text-lg">R${subtotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => { onNavigate("checkout"); onClose(); }}
                  className="w-full h-12 bg-[#C98F8A] hover:bg-[#B87A75] text-white text-sm font-semibold tracking-wide rounded-[12px] transition-colors duration-200"
                >
                  Finalizar Compra
                </button>
                <button
                  onClick={() => { onNavigate("cart"); onClose(); }}
                  className="w-full h-12 border border-[#ECE7E2] hover:bg-[#F5EFE9] text-sm font-medium rounded-[12px] transition-colors duration-200 text-[#2D2D2D]"
                >
                  Ver Carrinho
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onNavigate,
  onAddToCart,
  wishlist,
  onToggleWishlist,
}: {
  product: Product;
  onNavigate: (p: Page, product?: Product) => void;
  onAddToCart: (p: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isFav = wishlist.includes(product.id);

  return (
    <motion.div
      className="group relative bg-white rounded-[18px] border border-[#ECE7E2] overflow-hidden cursor-pointer"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <div
        className="relative aspect-[4/5] overflow-hidden bg-[#F5EFE9]"
        onClick={() => onNavigate("product", product)}
      >
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ opacity: hovered && product.hoverImage ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{ borderRadius: "18px 18px 0 0" }}
        />
        {product.hoverImage && (
          <motion.img
            src={product.hoverImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ borderRadius: "18px 18px 0 0" }}
          />
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge variant={product.badge === "Novo" ? "rose" : product.badge === "Sale" ? "default" : "champagne"}>
              {product.badge}
            </Badge>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow-sm hover:scale-110 transition-transform duration-150"
        >
          <Heart
            size={14}
            className={isFav ? "fill-[#C98F8A] text-[#C98F8A]" : "text-[#6E6A66]"}
          />
        </button>

        {/* Quick add overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-full h-10 bg-[#2D2D2D]/90 backdrop-blur-sm text-white text-xs font-semibold tracking-wider rounded-[10px] hover:bg-[#C98F8A] transition-colors duration-200"
          >
            Adicionar ao Carrinho
          </button>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-4" onClick={() => onNavigate("product", product)}>
        <p className="text-xs text-[#6E6A66] tracking-wide uppercase mb-1">{product.category}</p>
        <h3 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#2D2D2D] leading-tight mb-2">
          {product.name}
        </h3>
        <StarRating rating={product.rating} count={product.reviews} />
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[#C98F8A] font-semibold">R${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-[#6E6A66] text-sm line-through">R${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        <p className="text-[10px] text-[#6E6A66] mt-0.5">em até 12× R${(product.price / 12).toFixed(2)}</p>
      </div>
    </motion.div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({
  onNavigate,
  onAddToCart,
  wishlist,
  onToggleWishlist,
}: {
  onNavigate: (p: Page, product?: Product) => void;
  onAddToCart: (p: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="pt-[88px]">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=1600&h=1000&fit=crop&auto=format"
            alt="Lisory hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF8]/95 via-[#FDFBF8]/70 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <motion.div
            className="max-w-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-6">Nova Coleção</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl lg:text-7xl font-light text-[#2D2D2D] leading-[1.1] mb-6">
              Joias que<br />
              <em>permanecem</em><br />
              com você.
            </h1>
            <p className="text-[#6E6A66] text-base lg:text-lg leading-relaxed mb-10 max-w-md">
              Aço inoxidável premium. Hipoalergênico. Resistente à água.<br />Feito para durar uma vida inteira.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate("category")}
                className="h-12 px-8 bg-[#C98F8A] hover:bg-[#B87A75] text-white text-sm font-semibold tracking-wide rounded-[12px] transition-all duration-200 shadow-sm"
              >
                Comprar Agora
              </button>
              <button
                onClick={() => onNavigate("category")}
                className="h-12 px-8 border border-[#2D2D2D] text-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-white text-sm font-semibold tracking-wide rounded-[12px] transition-all duration-200"
              >
                Ver Coleção
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5 mt-12 pt-10 border-t border-[#ECE7E2]">
              {["Não escurece", "Hipoalergênico", "Resistente à água", "Garantia vitalícia"].map((seal) => (
                <div key={seal} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#C98F8A] rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={9} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-xs text-[#6E6A66]">{seal}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-[#2D2D2D] py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {[
            { icon: <Truck size={16} />, text: "Frete Grátis + R$199" },
            { icon: <RefreshCw size={16} />, text: "Troca em 30 dias" },
            { icon: <Shield size={16} />, text: "Compra Segura" },
            { icon: <Award size={16} />, text: "Garantia Vitalícia" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-white">
              <span className="text-[#C98F8A]">{item.icon}</span>
              <span className="text-[11px] tracking-widest uppercase">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-4">Explorar</p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#2D2D2D]">
            Nossas Categorias
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              onClick={() => onNavigate("category")}
              className="group relative aspect-[3/4] overflow-hidden rounded-[18px] bg-[#F5EFE9]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D]/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <p className="text-white font-['Cormorant_Garamond'] text-xl font-semibold">{cat.name}</p>
                <p className="text-white/70 text-xs mt-0.5">{cat.count} peças</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-4">Mais Pedidos</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#2D2D2D]">
                Mais Vendidos
              </h2>
            </div>
            <button
              onClick={() => onNavigate("category")}
              className="hidden lg:flex items-center gap-2 text-sm text-[#6E6A66] hover:text-[#C98F8A] transition-colors"
            >
              Ver todos <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.slice(0, 4).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard
                  product={p}
                  onNavigate={onNavigate}
                  onAddToCart={onAddToCart}
                  wishlist={wishlist}
                  onToggleWishlist={onToggleWishlist}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial banner */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[#F5EFE9]">
              <img
                src="https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=1000&fit=crop&auto=format"
                alt="Editorial Lisory"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-[18px] p-5 shadow-md border border-[#ECE7E2] hidden lg:block">
              <p className="font-['Cormorant_Garamond'] text-3xl font-light text-[#2D2D2D]">+12.000</p>
              <p className="text-xs text-[#6E6A66] mt-1">clientes satisfeitas</p>
            </div>
          </motion.div>
          <motion.div
            className="lg:pl-12"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-6">Nossa Promessa</p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#2D2D2D] leading-[1.2] mb-6">
              Beleza que resiste<br />ao tempo.
            </h2>
            <p className="text-[#6E6A66] leading-relaxed mb-8">
              Cada peça Lisory é criada com aço inox 316L — o mesmo material usado em implantes médicos. Nossa obsessão pela qualidade garante que você use suas joias no banho, academia, praia e no dia a dia sem preocupação.
            </p>
            <div className="space-y-4 mb-10">
              {[
                { icon: <Zap size={16} />, title: "Resistente à água", desc: "Sem manchas, sem escurecimento" },
                { icon: <Shield size={16} />, title: "Hipoalergênico", desc: "Seguro para peles sensíveis" },
                { icon: <Award size={16} />, title: "Garantia vitalícia", desc: "Porque acreditamos no que fazemos" },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className="w-9 h-9 bg-[#F5EFE9] rounded-[10px] flex items-center justify-center text-[#C98F8A] flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2D2D2D]">{item.title}</p>
                    <p className="text-xs text-[#6E6A66]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate("about")}
              className="h-12 px-8 border border-[#2D2D2D] text-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-white text-sm font-semibold tracking-wide rounded-[12px] transition-all duration-200"
            >
              Nossa História
            </button>
          </motion.div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="py-20 px-6 bg-[#F5EFE9]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-4">Acabou de Chegar</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#2D2D2D]">
                Lançamentos
              </h2>
            </div>
            <button
              onClick={() => onNavigate("category")}
              className="hidden lg:flex items-center gap-2 text-sm text-[#6E6A66] hover:text-[#C98F8A] transition-colors"
            >
              Ver todos <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.slice(4).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard
                  product={p}
                  onNavigate={onNavigate}
                  onAddToCart={onAddToCart}
                  wishlist={wishlist}
                  onToggleWishlist={onToggleWishlist}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-4">Depoimentos</p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#2D2D2D] mb-14">
            O que dizem sobre nós
          </h2>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-[#FDFBF8] rounded-[24px] p-10 border border-[#ECE7E2]"
              >
                <div className="flex justify-center mb-5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={18} className="fill-[#C98F8A] text-[#C98F8A]" />
                  ))}
                </div>
                <p className="font-['Cormorant_Garamond'] text-2xl lg:text-3xl font-light text-[#2D2D2D] italic leading-relaxed mb-8">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div>
                  <p className="font-semibold text-[#2D2D2D] text-sm">{testimonials[activeTestimonial].name}</p>
                  <p className="text-xs text-[#6E6A66]">{testimonials[activeTestimonial].location}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`rounded-full transition-all duration-200 ${i === activeTestimonial ? "w-6 h-2 bg-[#C98F8A]" : "w-2 h-2 bg-[#ECE7E2]"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-4">Siga-nos</p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#2D2D2D] mb-2">@lisory.joias</h2>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            "photo-1515562141207-7a88fb7ce338",
            "photo-1611591437281-460bfbe1220a",
            "photo-1605100804763-247f67b3557e",
            "photo-1535632066927-ab7c9ab60908",
            "photo-1583937443686-3ff98e736696",
            "photo-1599643478518-a784e5dc4c8f",
          ].map((id, i) => (
            <motion.div
              key={id}
              className="group relative aspect-square overflow-hidden rounded-[14px] bg-[#F5EFE9] cursor-pointer"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <img
                src={`https://images.unsplash.com/${id}?w=300&h=300&fit=crop&auto=format`}
                alt="Instagram"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#2D2D2D]/0 group-hover:bg-[#2D2D2D]/30 transition-colors duration-200 flex items-center justify-center">
                <Instagram size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-[#F5EFE9]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-4">Dúvidas</p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#2D2D2D]">Perguntas Frequentes</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-[16px] border border-[#ECE7E2] overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-[#2D2D2D] pr-4">{item.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-[#6E6A66] flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm text-[#6E6A66] leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 bg-[#2D2D2D]">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-6">Newsletter</p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl font-light text-white mb-4">
            Seja a primeira a saber.
          </h2>
          <p className="text-[#C9CDD2] text-sm mb-10 leading-relaxed">
            Receba lançamentos exclusivos, ofertas especiais e inspirações direto no seu e-mail.
          </p>
          {subscribed ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-2 text-[#3E8B5A]"
            >
              <Check size={18} />
              <span className="text-sm font-medium">Obrigada! Você está na lista.</span>
            </motion.div>
          ) : (
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="flex-1 h-12 px-5 bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm rounded-[12px] outline-none focus:border-[#C98F8A] transition-colors"
              />
              <button
                onClick={() => email && setSubscribed(true)}
                className="h-12 px-7 bg-[#C98F8A] hover:bg-[#B87A75] text-white text-sm font-semibold rounded-[12px] transition-colors whitespace-nowrap"
              >
                Inscrever
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// ─── Category Page ────────────────────────────────────────────────────────────
function CategoryPage({
  onNavigate,
  onAddToCart,
  wishlist,
  onToggleWishlist,
}: {
  onNavigate: (p: Page, product?: Product) => void;
  onAddToCart: (p: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState("Mais Vendidos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const sortOptions = ["Mais Vendidos", "Novidades", "Menor Preço", "Maior Preço", "Mais Avaliados"];
  const filterCats = ["Colares", "Pulseiras", "Anéis", "Brincos", "Conjuntos"];

  const filtered = products.filter((p) =>
    (selectedCats.length === 0 || selectedCats.includes(p.category)) &&
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  return (
    <main className="pt-[88px] min-h-screen bg-[#FDFBF8]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-xs text-[#6E6A66]">
          <button onClick={() => onNavigate("home")} className="hover:text-[#C98F8A] transition-colors">Início</button>
          <ChevronRight size={12} />
          <span className="text-[#2D2D2D]">Todas as Joias</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#2D2D2D]">
              Todas as Joias
            </h1>
            <p className="text-sm text-[#6E6A66] mt-2">{filtered.length} produtos</p>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="space-y-8 sticky top-28">
              {/* Categories */}
              <div>
                <h3 className="text-xs font-semibold tracking-widest uppercase text-[#2D2D2D] mb-4">Categoria</h3>
                <div className="space-y-2">
                  {filterCats.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                          selectedCats.includes(cat) ? "bg-[#C98F8A] border-[#C98F8A]" : "border-[#ECE7E2] group-hover:border-[#C98F8A]"
                        }`}
                        onClick={() =>
                          setSelectedCats((prev) =>
                            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                          )
                        }
                      >
                        {selectedCats.includes(cat) && <Check size={10} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-sm text-[#6E6A66] group-hover:text-[#2D2D2D] transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-xs font-semibold tracking-widest uppercase text-[#2D2D2D] mb-4">Preço</h3>
                <div className="space-y-3">
                  {[[0, 100], [100, 200], [200, 300], [300, 500]].map(([min, max]) => (
                    <label key={`${min}-${max}`} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          priceRange[0] === min && priceRange[1] === max ? "border-[#C98F8A]" : "border-[#ECE7E2] group-hover:border-[#C98F8A]"
                        }`}
                        onClick={() => setPriceRange([min, max])}
                      >
                        {priceRange[0] === min && priceRange[1] === max && (
                          <div className="w-2 h-2 bg-[#C98F8A] rounded-full" />
                        )}
                      </div>
                      <span className="text-sm text-[#6E6A66] group-hover:text-[#2D2D2D] transition-colors">
                        R${min} – R${max === 500 ? "500+" : max}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {(selectedCats.length > 0 || priceRange[0] > 0) && (
                <button
                  onClick={() => { setSelectedCats([]); setPriceRange([0, 500]); }}
                  className="text-xs text-[#C98F8A] underline underline-offset-2"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button
                  className="lg:hidden flex items-center gap-2 h-9 px-4 border border-[#ECE7E2] rounded-[10px] text-sm text-[#6E6A66] hover:border-[#C98F8A] transition-colors"
                  onClick={() => setFiltersOpen(true)}
                >
                  <SlidersHorizontal size={14} /> Filtros
                </button>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-9 pl-3 pr-8 bg-white border border-[#ECE7E2] rounded-[10px] text-sm text-[#6E6A66] outline-none appearance-none cursor-pointer hover:border-[#C98F8A] transition-colors"
                  >
                    {sortOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6A66] pointer-events-none" />
                </div>
                <div className="flex border border-[#ECE7E2] rounded-[10px] overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`w-9 h-9 flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-[#2D2D2D] text-white" : "text-[#6E6A66] hover:bg-[#F5EFE9]"}`}
                  >
                    <Grid3X3 size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`w-9 h-9 flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-[#2D2D2D] text-white" : "text-[#6E6A66] hover:bg-[#F5EFE9]"}`}
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className={`grid gap-4 lg:gap-6 ${viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  {viewMode === "grid" ? (
                    <ProductCard
                      product={p}
                      onNavigate={onNavigate}
                      onAddToCart={onAddToCart}
                      wishlist={wishlist}
                      onToggleWishlist={onToggleWishlist}
                    />
                  ) : (
                    <div className="flex gap-5 bg-white border border-[#ECE7E2] rounded-[18px] p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onNavigate("product", p)}>
                      <img src={p.image} alt={p.name} className="w-28 h-28 object-cover rounded-[14px] bg-[#F5EFE9]" />
                      <div className="flex-1">
                        <p className="text-xs text-[#6E6A66] uppercase tracking-wide mb-1">{p.category}</p>
                        <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#2D2D2D]">{p.name}</h3>
                        <StarRating rating={p.rating} count={p.reviews} />
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[#C98F8A] font-semibold">R${p.price.toFixed(2)}</span>
                          {p.originalPrice && <span className="text-[#6E6A66] text-sm line-through">R${p.originalPrice.toFixed(2)}</span>}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
                        className="self-center h-10 px-5 bg-[#C98F8A] hover:bg-[#B87A75] text-white text-xs font-semibold rounded-[10px] transition-colors"
                      >
                        Comprar
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-16">
              {[1, 2, 3, "...", 8].map((page, i) => (
                <button
                  key={i}
                  className={`w-9 h-9 flex items-center justify-center rounded-[10px] text-sm transition-colors ${
                    page === 1 ? "bg-[#2D2D2D] text-white" : "border border-[#ECE7E2] text-[#6E6A66] hover:border-[#C98F8A] hover:text-[#C98F8A]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Product Detail ───────────────────────────────────────────────────────────
function ProductDetailPage({
  product,
  onNavigate,
  onAddToCart,
  wishlist,
  onToggleWishlist,
}: {
  product: Product;
  onNavigate: (p: Page, product?: Product) => void;
  onAddToCart: (p: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("descricao");
  const [added, setAdded] = useState(false);
  const isFav = wishlist.includes(product.id);

  const images = [
    product.image,
    product.hoverImage || product.image,
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=700&fit=crop&auto=format",
  ];

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const tabs = [
    { id: "descricao", label: "Descrição" },
    { id: "detalhes", label: "Detalhes" },
    { id: "medidas", label: "Medidas" },
    { id: "avaliacoes", label: `Avaliações (${product.reviews})` },
  ];

  return (
    <main className="pt-[88px] min-h-screen bg-[#FDFBF8]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#6E6A66] mb-8">
          <button onClick={() => onNavigate("home")} className="hover:text-[#C98F8A] transition-colors">Início</button>
          <ChevronRight size={12} />
          <button onClick={() => onNavigate("category")} className="hover:text-[#C98F8A] transition-colors">{product.category}</button>
          <ChevronRight size={12} />
          <span className="text-[#2D2D2D]">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3 w-20 flex-shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square overflow-hidden rounded-[12px] border-2 transition-all ${
                    selectedImage === i ? "border-[#C98F8A]" : "border-[#ECE7E2] hover:border-[#D8A29A]"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-1 relative aspect-[4/5] bg-[#F5EFE9] rounded-[20px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <Badge variant="rose">{product.badge}</Badge>
                </div>
              )}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
              >
                <Heart size={18} className={isFav ? "fill-[#C98F8A] text-[#C98F8A]" : "text-[#6E6A66]"} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-[#6E6A66] mb-3">{product.category}</p>
              <h1 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#2D2D2D] leading-tight mb-4">
                {product.name}
              </h1>
              <StarRating rating={product.rating} count={product.reviews} />
            </div>

            {/* Price */}
            <div className="bg-white border border-[#ECE7E2] rounded-[18px] p-5">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-semibold text-[#C98F8A]">R${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-[#6E6A66] line-through">R${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <p className="text-sm text-[#6E6A66]">em até 12× de R${(product.price / 12).toFixed(2)} sem juros</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#ECE7E2]">
                <Zap size={14} className="text-[#3E8B5A]" />
                <span className="text-sm text-[#3E8B5A] font-medium">
                  PIX: R${(product.price * 0.95).toFixed(2)} (5% de desconto)
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#2D2D2D] mb-3">Quantidade</p>
              <div className="flex items-center border border-[#ECE7E2] rounded-[12px] w-fit overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-[#F5EFE9] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-medium text-sm">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-11 h-11 flex items-center justify-center hover:bg-[#F5EFE9] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className={`w-full h-12 text-sm font-semibold tracking-wide rounded-[12px] transition-all duration-200 ${
                  added
                    ? "bg-[#3E8B5A] text-white"
                    : "bg-[#C98F8A] hover:bg-[#B87A75] text-white"
                }`}
              >
                {added ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check size={16} /> Adicionado!
                  </span>
                ) : (
                  "Adicionar ao Carrinho"
                )}
              </button>
              <button
                onClick={() => { onAddToCart(product); onNavigate("checkout"); }}
                className="w-full h-12 bg-[#2D2D2D] hover:bg-[#404040] text-white text-sm font-semibold tracking-wide rounded-[12px] transition-colors duration-200"
              >
                Comprar Agora
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Truck size={14} />, text: "Frete grátis acima de R$199" },
                { icon: <RefreshCw size={14} />, text: "Troca grátis em 30 dias" },
                { icon: <Shield size={14} />, text: "Compra 100% segura" },
                { icon: <Award size={14} />, text: "Garantia vitalícia" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 p-3 bg-[#F5EFE9] rounded-[12px]">
                  <span className="text-[#C98F8A] flex-shrink-0">{item.icon}</span>
                  <span className="text-xs text-[#6E6A66]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="flex border-b border-[#ECE7E2] gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id ? "text-[#2D2D2D]" : "text-[#6E6A66] hover:text-[#2D2D2D]"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C98F8A]"
                    layoutId="tab-indicator"
                  />
                )}
              </button>
            ))}
          </div>
          <div className="py-10 max-w-2xl">
            {activeTab === "descricao" && (
              <div className="space-y-4 text-sm text-[#6E6A66] leading-relaxed">
                <p>
                  O <strong className="text-[#2D2D2D]">{product.name}</strong> é uma peça atemporal da coleção Lisory, criada para mulheres que valorizam sofisticação e durabilidade.
                </p>
                <p>
                  Produzida em aço inoxidável 316L de grau cirúrgico, a peça mantém seu brilho e estrutura mesmo com o uso diário, contato com água, suor e perfumes.
                </p>
                <p>
                  O acabamento premium e o design minimalista fazem dela a joia perfeita para compor qualquer look — do casual ao mais elegante.
                </p>
              </div>
            )}
            {activeTab === "detalhes" && (
              <div className="space-y-3">
                {[
                  { label: "Material", value: "Aço inoxidável 316L" },
                  { label: "Acabamento", value: "Banhado a ouro 18k" },
                  { label: "Resistência", value: "Resistente à água, suor e perfume" },
                  { label: "Hipoalergênico", value: "Sim — grau cirúrgico" },
                  { label: "Garantia", value: "Vitalícia contra defeitos de fabricação" },
                  { label: "Embalagem", value: "Caixa premium + saquinho de veludo" },
                ].map((row) => (
                  <div key={row.label} className="flex py-3 border-b border-[#ECE7E2]">
                    <span className="text-sm text-[#6E6A66] w-40">{row.label}</span>
                    <span className="text-sm text-[#2D2D2D] font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "medidas" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#ECE7E2]">
                      {["Tamanho", "Comprimento", "Largura", "Peso"].map((h) => (
                        <th key={h} className="text-left py-3 pr-8 text-xs font-semibold text-[#2D2D2D] uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[["P", "40cm", "2mm", "3g"], ["M", "45cm", "2mm", "3.5g"], ["G", "50cm", "2mm", "4g"]].map((row) => (
                      <tr key={row[0]} className="border-b border-[#ECE7E2]">
                        {row.map((cell, i) => (
                          <td key={i} className="py-3 pr-8 text-[#6E6A66]">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "avaliacoes" && (
              <div className="space-y-6">
                {[
                  { name: "Ana Clara S.", rating: 5, date: "15 jun 2025", text: "Perfeita! Exatamente como nas fotos. A qualidade é impressionante e chegou muito bem embalada." },
                  { name: "Mariana R.", rating: 5, date: "02 jun 2025", text: "Uso todos os dias, inclusive no mar, e mantém o brilho impecável. Já comprei outras peças!" },
                  { name: "Juliana F.", rating: 4, date: "28 mai 2025", text: "Peça linda e delicada. Entrega rápida. Só tirei um ponto porque a embalagem veio um pouquinho amassada." },
                ].map((review, i) => (
                  <div key={i} className="border-b border-[#ECE7E2] pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#E9D7C7] rounded-full flex items-center justify-center text-xs font-semibold text-[#2D2D2D]">
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2D2D2D]">{review.name}</p>
                          <p className="text-xs text-[#6E6A66]">{review.date}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} count={0} />
                    </div>
                    <p className="text-sm text-[#6E6A66] leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <div className="mt-10">
          <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#2D2D2D] mb-8">
            Você também pode gostar
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={onNavigate}
                onAddToCart={onAddToCart}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Cart Page ────────────────────────────────────────────────────────────────
function CartPage({
  cart,
  onRemove,
  onQtyChange,
  onNavigate,
}: {
  cart: CartItem[];
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
  onNavigate: (p: Page) => void;
}) {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= 199 ? 0 : 19.9;
  const total = subtotal + shipping;

  return (
    <main className="pt-[88px] min-h-screen bg-[#FDFBF8]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#2D2D2D] mb-10">
          Carrinho de Compras
        </h1>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <ShoppingBag size={56} className="text-[#ECE7E2]" />
            <p className="text-[#6E6A66]">Seu carrinho está vazio</p>
            <button
              onClick={() => onNavigate("category")}
              className="h-12 px-8 bg-[#C98F8A] hover:bg-[#B87A75] text-white text-sm font-semibold rounded-[12px] transition-colors"
            >
              Explorar Joias
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="flex gap-5 bg-white border border-[#ECE7E2] rounded-[18px] p-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-[14px] bg-[#F5EFE9] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#2D2D2D]">{item.name}</h3>
                      <button onClick={() => onRemove(item.id)} className="text-[#6E6A66] hover:text-[#D64F4F] transition-colors flex-shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-[#C98F8A] font-semibold mt-1">R${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#ECE7E2] rounded-[10px] overflow-hidden">
                        <button onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-[#F5EFE9] transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.qty}</span>
                        <button onClick={() => onQtyChange(item.id, item.qty + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-[#F5EFE9] transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-[#2D2D2D]">
                        R${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-white border border-[#ECE7E2] rounded-[18px] p-6 space-y-4">
                <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#2D2D2D]">Resumo</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6E6A66]">Subtotal</span>
                    <span className="text-[#2D2D2D] font-medium">R${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6E6A66]">Frete</span>
                    <span className={shipping === 0 ? "text-[#3E8B5A] font-medium" : "text-[#2D2D2D] font-medium"}>
                      {shipping === 0 ? "Grátis" : `R$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#ECE7E2] flex justify-between">
                  <span className="font-semibold text-[#2D2D2D]">Total</span>
                  <span className="text-xl font-semibold text-[#C98F8A]">R${total.toFixed(2)}</span>
                </div>
                {/* Coupon */}
                <div className="flex gap-2 pt-2">
                  <div className="flex-1 flex items-center gap-2 border border-[#ECE7E2] rounded-[10px] px-3 h-10">
                    <Tag size={14} className="text-[#6E6A66]" />
                    <input placeholder="Cupom de desconto" className="flex-1 text-sm bg-transparent outline-none placeholder-[#6E6A66]" />
                  </div>
                  <button className="h-10 px-4 border border-[#ECE7E2] hover:border-[#C98F8A] text-sm text-[#6E6A66] hover:text-[#C98F8A] rounded-[10px] transition-colors whitespace-nowrap">
                    Aplicar
                  </button>
                </div>
                <button
                  onClick={() => onNavigate("checkout")}
                  className="w-full h-12 bg-[#C98F8A] hover:bg-[#B87A75] text-white text-sm font-semibold rounded-[12px] transition-colors"
                >
                  Finalizar Compra
                </button>
                <button
                  onClick={() => onNavigate("category")}
                  className="w-full h-10 text-sm text-[#6E6A66] hover:text-[#C98F8A] transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>

              {/* Trust */}
              <div className="bg-[#F5EFE9] rounded-[18px] p-5 space-y-3">
                {[
                  { icon: <Shield size={14} />, text: "Pagamento 100% seguro" },
                  { icon: <RefreshCw size={14} />, text: "Troca garantida em 30 dias" },
                  { icon: <Truck size={14} />, text: "Entrega para todo o Brasil" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <span className="text-[#C98F8A]">{item.icon}</span>
                    <span className="text-xs text-[#6E6A66]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ─── Checkout ─────────────────────────────────────────────────────────────────
function CheckoutPage({
  cart,
  onNavigate,
}: {
  cart: CartItem[];
  onNavigate: (p: Page) => void;
}) {
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState("pix");
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const steps = ["Identificação", "Endereço", "Entrega", "Pagamento"];

  return (
    <main className="pt-[88px] min-h-screen bg-[#FDFBF8]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Progress */}
        <div className="flex items-center mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    i + 1 < step ? "bg-[#3E8B5A] text-white" :
                    i + 1 === step ? "bg-[#C98F8A] text-white" :
                    "bg-[#ECE7E2] text-[#6E6A66]"
                  }`}
                >
                  {i + 1 < step ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i + 1 === step ? "text-[#2D2D2D]" : "text-[#6E6A66]"}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${i + 1 < step ? "bg-[#3E8B5A]" : "bg-[#ECE7E2]"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#2D2D2D] mb-6">Identificação</h2>
                <div className="grid gap-4">
                  {[
                    { label: "Nome completo", placeholder: "Ana Silva" },
                    { label: "E-mail", placeholder: "ana@email.com", type: "email" },
                    { label: "CPF", placeholder: "000.000.000-00" },
                    { label: "Telefone", placeholder: "(11) 99999-9999" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs font-semibold text-[#2D2D2D] mb-2 tracking-wide">{field.label}</label>
                      <input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        className="w-full h-12 px-4 border border-[#ECE7E2] rounded-[12px] text-sm text-[#2D2D2D] placeholder-[#6E6A66] outline-none focus:border-[#C98F8A] transition-colors bg-white"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#2D2D2D] mb-6">Endereço de Entrega</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "CEP", placeholder: "00000-000", full: false },
                    { label: "Rua", placeholder: "Nome da rua", full: true },
                    { label: "Número", placeholder: "123", full: false },
                    { label: "Complemento", placeholder: "Apto, Sala...", full: false },
                    { label: "Bairro", placeholder: "Bairro", full: false },
                    { label: "Cidade", placeholder: "Cidade", full: false },
                    { label: "Estado", placeholder: "Estado", full: false },
                  ].map((field) => (
                    <div key={field.label} className={field.full ? "col-span-2" : ""}>
                      <label className="block text-xs font-semibold text-[#2D2D2D] mb-2">{field.label}</label>
                      <input
                        placeholder={field.placeholder}
                        className="w-full h-12 px-4 border border-[#ECE7E2] rounded-[12px] text-sm text-[#2D2D2D] placeholder-[#6E6A66] outline-none focus:border-[#C98F8A] transition-colors bg-white"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#2D2D2D] mb-6">Método de Entrega</h2>
                <div className="space-y-3">
                  {[
                    { name: "PAC", days: "5 a 10 dias úteis", price: "Grátis", tag: "" },
                    { name: "SEDEX", days: "1 a 3 dias úteis", price: "R$19,90", tag: "Mais Rápido" },
                    { name: "Expressa Premium", days: "Amanhã", price: "R$34,90", tag: "Recomendado" },
                  ].map((opt, i) => (
                    <label key={opt.name} className="flex items-center gap-4 p-4 bg-white border border-[#ECE7E2] rounded-[14px] cursor-pointer hover:border-[#C98F8A] transition-colors">
                      <div className="w-4 h-4 rounded-full border-2 border-[#C98F8A] flex items-center justify-center flex-shrink-0">
                        {i === 0 && <div className="w-2 h-2 bg-[#C98F8A] rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#2D2D2D]">{opt.name}</span>
                          {opt.tag && <Badge variant="champagne">{opt.tag}</Badge>}
                        </div>
                        <p className="text-xs text-[#6E6A66] mt-0.5">{opt.days}</p>
                      </div>
                      <span className={`text-sm font-semibold ${opt.price === "Grátis" ? "text-[#3E8B5A]" : "text-[#2D2D2D]"}`}>
                        {opt.price}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#2D2D2D] mb-6">Pagamento</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {[
                    { id: "pix", label: "PIX", desc: "5% de desconto" },
                    { id: "card", label: "Cartão", desc: "Até 12×" },
                    { id: "boleto", label: "Boleto", desc: "3 dias úteis" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`p-4 border rounded-[14px] text-left transition-all ${payMethod === m.id ? "border-[#C98F8A] bg-[#FDF5F4]" : "border-[#ECE7E2] bg-white hover:border-[#D8A29A]"}`}
                    >
                      <p className="text-sm font-semibold text-[#2D2D2D]">{m.label}</p>
                      <p className="text-xs text-[#6E6A66] mt-0.5">{m.desc}</p>
                    </button>
                  ))}
                </div>

                {payMethod === "pix" && (
                  <div className="bg-[#F5EFE9] rounded-[18px] p-6 text-center">
                    <div className="w-40 h-40 bg-white rounded-[14px] mx-auto mb-4 flex items-center justify-center border border-[#ECE7E2]">
                      <div className="grid grid-cols-5 gap-1 p-2">
                        {Array(25).fill(0).map((_, i) => (
                          <div key={i} className={`w-4 h-4 rounded-[2px] ${Math.random() > 0.5 ? "bg-[#2D2D2D]" : "bg-transparent"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#6E6A66] mb-2">Escaneie o QR Code ou copie a chave</p>
                    <button className="flex items-center gap-2 mx-auto text-xs text-[#C98F8A] underline underline-offset-2">
                      <Copy size={12} /> Copiar chave PIX
                    </button>
                  </div>
                )}

                {payMethod === "card" && (
                  <div className="space-y-4">
                    {[
                      { label: "Número do Cartão", placeholder: "0000 0000 0000 0000" },
                      { label: "Nome no Cartão", placeholder: "ANA SILVA" },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="block text-xs font-semibold text-[#2D2D2D] mb-2">{f.label}</label>
                        <input placeholder={f.placeholder} className="w-full h-12 px-4 border border-[#ECE7E2] rounded-[12px] text-sm outline-none focus:border-[#C98F8A] bg-white transition-colors" />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#2D2D2D] mb-2">Validade</label>
                        <input placeholder="MM/AA" className="w-full h-12 px-4 border border-[#ECE7E2] rounded-[12px] text-sm outline-none focus:border-[#C98F8A] bg-white transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#2D2D2D] mb-2">CVV</label>
                        <input placeholder="000" className="w-full h-12 px-4 border border-[#ECE7E2] rounded-[12px] text-sm outline-none focus:border-[#C98F8A] bg-white transition-colors" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="h-12 px-6 border border-[#ECE7E2] text-sm text-[#6E6A66] hover:border-[#C98F8A] hover:text-[#C98F8A] rounded-[12px] transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={16} /> Voltar
                </button>
              ) : (
                <button
                  onClick={() => onNavigate("cart")}
                  className="h-12 px-6 border border-[#ECE7E2] text-sm text-[#6E6A66] hover:border-[#C98F8A] hover:text-[#C98F8A] rounded-[12px] transition-colors"
                >
                  Voltar ao Carrinho
                </button>
              )}
              <button
                onClick={() => step < 4 ? setStep(step + 1) : onNavigate("confirmation")}
                className="h-12 px-8 bg-[#C98F8A] hover:bg-[#B87A75] text-white text-sm font-semibold rounded-[12px] transition-colors flex items-center gap-2"
              >
                {step === 4 ? "Finalizar Pedido" : "Continuar"} <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white border border-[#ECE7E2] rounded-[18px] p-6 sticky top-28">
              <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#2D2D2D] mb-5">Resumo do Pedido</h3>
              <div className="space-y-4 mb-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-[10px] bg-[#F5EFE9]" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6E6A66] text-white text-[10px] rounded-full flex items-center justify-center">{item.qty}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-[#2D2D2D] leading-snug">{item.name}</p>
                      <p className="text-xs text-[#C98F8A] font-semibold mt-0.5">R${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#ECE7E2] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E6A66]">Subtotal</span>
                  <span>R${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E6A66]">Frete</span>
                  <span className="text-[#3E8B5A]">{subtotal >= 199 ? "Grátis" : "A calcular"}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-[#ECE7E2]">
                  <span>Total</span>
                  <span className="text-[#C98F8A]">R${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Order Confirmation ───────────────────────────────────────────────────────
function ConfirmationPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <main className="pt-[88px] min-h-screen bg-[#FDFBF8] flex items-center justify-center px-6">
      <motion.div
        className="max-w-lg w-full text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 bg-[#3E8B5A] rounded-full flex items-center justify-center mx-auto mb-8">
          <Check size={36} className="text-white" strokeWidth={2.5} />
        </div>
        <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-4">Pedido Confirmado</p>
        <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#2D2D2D] mb-4">
          Obrigada pela sua compra!
        </h1>
        <p className="text-[#6E6A66] text-sm leading-relaxed mb-8">
          Recebemos seu pedido e em breve você receberá um e-mail com os detalhes e o código de rastreamento.
        </p>

        <div className="bg-white border border-[#ECE7E2] rounded-[24px] p-6 text-left mb-8">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Número do Pedido", value: "#LSR-2025-08421" },
              { label: "Pagamento", value: "PIX — Aprovado" },
              { label: "Entrega Estimada", value: "3 a 7 dias úteis" },
              { label: "E-mail", value: "ana@email.com" },
            ].map((row) => (
              <div key={row.label}>
                <p className="text-xs text-[#6E6A66] mb-1">{row.label}</p>
                <p className="text-sm font-semibold text-[#2D2D2D]">{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button className="w-full h-12 bg-[#C98F8A] hover:bg-[#B87A75] text-white text-sm font-semibold rounded-[12px] transition-colors flex items-center justify-center gap-2">
            <Package size={16} /> Acompanhar Pedido
          </button>
          <button
            onClick={() => onNavigate("home")}
            className="w-full h-12 border border-[#ECE7E2] text-sm text-[#6E6A66] hover:bg-[#F5EFE9] rounded-[12px] transition-colors"
          >
            Continuar Comprando
          </button>
        </div>
      </motion.div>
    </main>
  );
}

// ─── Account Page ─────────────────────────────────────────────────────────────
function AccountPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [activeSection, setActiveSection] = useState("pedidos");

  const sidebarItems = [
    { id: "pedidos", label: "Meus Pedidos", icon: <Package size={16} /> },
    { id: "favoritos", label: "Lista de Desejos", icon: <Heart size={16} /> },
    { id: "enderecos", label: "Endereços", icon: <MapPin size={16} /> },
    { id: "cartoes", label: "Cartões", icon: <CreditCard size={16} /> },
    { id: "dados", label: "Dados Pessoais", icon: <User size={16} /> },
  ];

  const orders = [
    { id: "#LSR-2025-08421", date: "15 jun 2025", status: "Entregue", items: 2, total: 338 },
    { id: "#LSR-2025-07103", date: "02 mai 2025", status: "Em trânsito", items: 1, total: 189 },
    { id: "#LSR-2025-05842", date: "18 mar 2025", status: "Entregue", items: 3, total: 527 },
  ];

  return (
    <main className="pt-[88px] min-h-screen bg-[#FDFBF8]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="space-y-2">
            <div className="bg-white border border-[#ECE7E2] rounded-[18px] p-5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#E9D7C7] rounded-full flex items-center justify-center text-lg font-semibold text-[#2D2D2D]">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2D2D2D]">Ana Silva</p>
                  <p className="text-xs text-[#6E6A66]">ana@email.com</p>
                </div>
              </div>
            </div>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-[#C98F8A] text-white"
                    : "text-[#6E6A66] hover:bg-[#F5EFE9] hover:text-[#2D2D2D]"
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm text-[#D64F4F] hover:bg-red-50 transition-colors mt-4">
              <LogOut size={16} /> Sair
            </button>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeSection === "pedidos" && (
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#2D2D2D] mb-6">Meus Pedidos</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-[#ECE7E2] rounded-[18px] p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-semibold text-[#2D2D2D]">{order.id}</p>
                          <p className="text-xs text-[#6E6A66]">{order.date} · {order.items} item(s)</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={order.status === "Entregue" ? "champagne" : "rose"}>
                            {order.status}
                          </Badge>
                          <span className="text-sm font-semibold text-[#2D2D2D]">R${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-3 border-t border-[#ECE7E2]">
                        <button className="text-xs text-[#C98F8A] hover:underline">Ver detalhes</button>
                        <span className="text-[#ECE7E2]">·</span>
                        <button className="text-xs text-[#6E6A66] hover:text-[#C98F8A] transition-colors">Rastrear</button>
                        {order.status === "Entregue" && (
                          <>
                            <span className="text-[#ECE7E2]">·</span>
                            <button className="text-xs text-[#6E6A66] hover:text-[#C98F8A] transition-colors">Solicitar troca</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection !== "pedidos" && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 bg-[#F5EFE9] rounded-full flex items-center justify-center text-[#C98F8A]">
                  {sidebarItems.find((s) => s.id === activeSection)?.icon}
                </div>
                <h2 className="font-['Cormorant_Garamond'] text-2xl font-light text-[#2D2D2D]">
                  {sidebarItems.find((s) => s.id === activeSection)?.label}
                </h2>
                <p className="text-sm text-[#6E6A66]">Seção em breve disponível</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Wishlist Page ────────────────────────────────────────────────────────────
function WishlistPage({
  wishlist,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
}: {
  wishlist: string[];
  onNavigate: (p: Page, product?: Product) => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (id: string) => void;
}) {
  const favProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <main className="pt-[88px] min-h-screen bg-[#FDFBF8]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#2D2D2D] mb-10">
          Lista de Desejos
        </h1>
        {favProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <Heart size={56} className="text-[#ECE7E2]" />
            <p className="text-[#6E6A66]">Sua lista de desejos está vazia</p>
            <button
              onClick={() => onNavigate("category")}
              className="h-12 px-8 bg-[#C98F8A] hover:bg-[#B87A75] text-white text-sm font-semibold rounded-[12px] transition-colors"
            >
              Explorar Joias
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {favProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={onNavigate}
                onAddToCart={onAddToCart}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// ─── About Page ───────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <main className="pt-[88px] min-h-screen bg-[#FDFBF8]">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-6">Nossa História</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl lg:text-6xl font-light text-[#2D2D2D] leading-[1.1] mb-8">
              Nascemos da paixão<br />por <em>elegância</em>.
            </h1>
            <p className="text-[#6E6A66] leading-relaxed mb-6">
              A Lisory nasceu do desejo de democratizar o luxo. Acreditamos que toda mulher merece usar joias de alta qualidade, sem abrir mão da durabilidade e do design sofisticado.
            </p>
            <p className="text-[#6E6A66] leading-relaxed">
              Cada peça é cuidadosamente desenvolvida para unir beleza atemporal e resistência real — joias que acompanham você em todos os momentos da vida.
            </p>
          </div>
          <div className="relative aspect-square rounded-[24px] overflow-hidden bg-[#F5EFE9]">
            <img
              src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=800&h=800&fit=crop&auto=format"
              alt="Lisory editorial"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { value: "+12.000", label: "Clientes satisfeitas" },
            { value: "5★", label: "Avaliação média" },
            { value: "100%", label: "Aço inox 316L" },
            { value: "Vitalícia", label: "Garantia" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-[#ECE7E2] rounded-[18px] p-6 text-center">
              <p className="font-['Cormorant_Garamond'] text-4xl font-light text-[#C98F8A] mb-2">{stat.value}</p>
              <p className="text-xs text-[#6E6A66] uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#2D2D2D] rounded-[24px] p-12 lg:p-16 text-center">
          <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-6">Nossa Missão</p>
          <p className="font-['Cormorant_Garamond'] text-3xl lg:text-5xl font-light text-white leading-relaxed max-w-3xl mx-auto">
            "Criar joias que permanecem com você — na beleza, na resistência e nos momentos que importam."
          </p>
        </div>
      </div>
    </main>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────
function ContactPage() {
  return (
    <main className="pt-[88px] min-h-screen bg-[#FDFBF8]">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-4">Fale Conosco</p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl font-light text-[#2D2D2D]">Estamos aqui para você</h1>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { icon: <MessageCircle size={20} />, label: "WhatsApp", value: "(11) 99999-0000", sub: "Seg–Sex, 9h–18h" },
              { icon: <Mail size={20} />, label: "E-mail", value: "oi@lisory.com.br", sub: "Resposta em até 24h" },
              { icon: <Instagram size={20} />, label: "Instagram", value: "@lisory.joias", sub: "DM sempre aberto" },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 bg-white border border-[#ECE7E2] rounded-[18px] p-5">
                <div className="w-10 h-10 bg-[#F5EFE9] rounded-[12px] flex items-center justify-center text-[#C98F8A] flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-[#6E6A66] uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-[#2D2D2D]">{item.value}</p>
                  <p className="text-xs text-[#6E6A66]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#ECE7E2] rounded-[24px] p-8 space-y-5">
            <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#2D2D2D]">Envie uma mensagem</h3>
            {[
              { label: "Nome", placeholder: "Seu nome" },
              { label: "E-mail", placeholder: "seu@email.com", type: "email" },
              { label: "Assunto", placeholder: "Dúvida, troca, sugestão..." },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-[#2D2D2D] mb-2">{f.label}</label>
                <input type={f.type || "text"} placeholder={f.placeholder} className="w-full h-12 px-4 border border-[#ECE7E2] rounded-[12px] text-sm outline-none focus:border-[#C98F8A] bg-[#FDFBF8] transition-colors" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-[#2D2D2D] mb-2">Mensagem</label>
              <textarea rows={4} placeholder="Escreva sua mensagem..." className="w-full px-4 py-3 border border-[#ECE7E2] rounded-[12px] text-sm outline-none focus:border-[#C98F8A] bg-[#FDFBF8] transition-colors resize-none" />
            </div>
            <button className="w-full h-12 bg-[#C98F8A] hover:bg-[#B87A75] text-white text-sm font-semibold rounded-[12px] transition-colors">
              Enviar Mensagem
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <footer className="bg-[#2D2D2D] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <p className="font-['Cormorant_Garamond'] text-2xl font-semibold tracking-[0.2em] mb-2">LISORY</p>
            <p className="text-[10px] tracking-[0.4em] text-[#C9CDD2] uppercase mb-5">Fine Jewelry</p>
            <p className="text-sm text-[#C9CDD2] leading-relaxed mb-6">
              Joias premium em aço inox 316L que unem elegância, durabilidade e sofisticação.
            </p>
            <div className="flex gap-3">
              {[Instagram, Mail, Phone].map((Icon, i) => (
                <button key={i} className="w-9 h-9 border border-white/20 rounded-full flex items-center justify-center text-[#C9CDD2] hover:text-[#C98F8A] hover:border-[#C98F8A] transition-colors">
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {[
            {
              title: "Joias",
              links: ["Colares", "Pulseiras", "Anéis", "Brincos", "Conjuntos", "Lançamentos"],
            },
            {
              title: "Atendimento",
              links: ["FAQ", "Trocas e Devoluções", "Rastreamento", "Política de Privacidade", "Termos de Uso"],
            },
            {
              title: "Empresa",
              links: ["Sobre Nós", "Contato", "Blog", "Trabalhe Conosco"],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold tracking-widest uppercase text-white mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        if (link === "Sobre Nós") onNavigate("about");
                        else if (link === "Contato") onNavigate("contact");
                        else if (link === "FAQ") onNavigate("faq");
                        else onNavigate("category");
                      }}
                      className="text-sm text-[#C9CDD2] hover:text-[#C98F8A] transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#C9CDD2]">© 2025 Lisory. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "PIX", "Boleto", "AmEx"].map((m) => (
              <span key={m} className="px-2.5 py-1 bg-white/10 rounded-[6px] text-[10px] text-[#C9CDD2]">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── FAQ Page ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-[16px] border border-[#ECE7E2] overflow-hidden">
      <button className="w-full flex items-center justify-between p-6 text-left" onClick={() => setOpen(!open)}>
        <span className="text-sm font-semibold text-[#2D2D2D] pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-[#6E6A66] flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="px-6 pb-6 text-sm text-[#6E6A66] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqPage() {
  const allFaqs = [
    ...faqItems,
    { q: "Qual o tamanho das peças?", a: "Disponibilizamos colares em 40cm, 45cm e 50cm; pulseiras em 17cm e 19cm; anéis nos tamanhos 12 ao 22. Consulte nossa tabela de medidas para escolher corretamente." },
    { q: "Como cuidar das minhas joias Lisory?", a: "Apesar de serem resistentes, recomendamos limpeza suave com pano macio. Evite exposição direta a produtos químicos concentrados como alvejante." },
    { q: "As joias vêm em embalagem para presente?", a: "Sim! Todas as peças são enviadas em uma caixa premium Lisory com saquinho de veludo, perfeitas para presentear." },
  ];

  return (
    <main className="pt-[88px] min-h-screen bg-[#FDFBF8]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.4em] text-[#C98F8A] uppercase mb-4">Dúvidas</p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl font-light text-[#2D2D2D]">Perguntas Frequentes</h1>
        </div>
        <div className="space-y-3">
          {allFaqs.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
        </div>
      </div>
    </main>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);

  const navigate = (p: Page, product?: Product) => {
    if (product) setSelectedProduct(product);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, image: product.image }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id: string, qty: number) =>
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));

  const toggleWishlist = (id: string) =>
    setWishlist((prev) => prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const showFooter = !["checkout", "confirmation"].includes(page);

  return (
    <div className="min-h-screen bg-[#FDFBF8] font-['Inter',sans-serif]">
      <Navbar
        onNavigate={navigate}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlist.length}
        currentPage={page}
      />

      <MiniCart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onQtyChange={updateQty}
        onNavigate={navigate}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {page === "home" && (
            <HomePage
              onNavigate={navigate}
              onAddToCart={addToCart}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          )}
          {page === "category" && (
            <CategoryPage
              onNavigate={navigate}
              onAddToCart={addToCart}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          )}
          {page === "product" && (
            <ProductDetailPage
              product={selectedProduct}
              onNavigate={navigate}
              onAddToCart={addToCart}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          )}
          {page === "cart" && (
            <CartPage cart={cart} onRemove={removeFromCart} onQtyChange={updateQty} onNavigate={navigate} />
          )}
          {page === "checkout" && (
            <CheckoutPage cart={cart} onNavigate={navigate} />
          )}
          {page === "confirmation" && <ConfirmationPage onNavigate={navigate} />}
          {page === "account" && <AccountPage onNavigate={navigate} />}
          {page === "wishlist" && (
            <WishlistPage
              wishlist={wishlist}
              onNavigate={navigate}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
            />
          )}
          {page === "about" && <AboutPage />}
          {page === "contact" && <ContactPage />}
          {page === "faq" && <FaqPage />}
        </motion.div>
      </AnimatePresence>

      {showFooter && <Footer onNavigate={navigate} />}
    </div>
  );
}
