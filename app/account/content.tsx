"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  User,
  LogOut,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface UserOrder {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  items: { productName: string; quantity: number; unitPrice: number; productImage: string | null }[];
  paymentMethod: string | null;
  paymentStatus: string | null;
  trackingCode: string | null;
  shipmentStatus: string | null;
  addressSummary: string | null;
  createdAt: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  AGUARDANDO_PAGAMENTO: { label: "Aguardando Pagamento", color: "bg-amber-100 text-amber-700" },
  PAGO: { label: "Pago", color: "bg-blue-100 text-blue-700" },
  PROCESSANDO: { label: "Processando", color: "bg-purple-100 text-purple-700" },
  ENVIADO: { label: "Enviado", color: "bg-indigo-100 text-indigo-700" },
  ENTREGUE: { label: "Entregue", color: "bg-emerald-100 text-emerald-700" },
  CANCELADO: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

const sidebarItems = [
  { id: "pedidos", label: "Meus Pedidos", icon: Package },
  { id: "enderecos", label: "Enderecos", icon: MapPin },
  { id: "dados", label: "Dados Pessoais", icon: User },
];

export function AccountPageContent() {
  const [activeSection, setActiveSection] = useState("pedidos");
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadOrders() {
      if (!user) return;
      try {
        const data = await api.get<{ content: UserOrder[]; totalElements: number }>(
          "/api/user/orders?size=50"
        );
        setOrders(data.content);
      } catch {
        toast.error("Erro ao carregar pedidos");
      } finally {
        setLoadingOrders(false);
      }
    }
    if (user) {
      loadOrders();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const ActiveIcon = sidebarItems.find((s) => s.id === activeSection)?.icon || User;

  if (authLoading) {
    return (
      <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8]">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-[#D97D93]" />
        </div>
      </main>
    );
  }

  if (!user) return null;

  const userInitial = user.email?.charAt(0).toUpperCase() || "U";

  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="space-y-2">
            <div className="bg-white border border-[#F2DCDD] rounded-[18px] p-5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FCEEEF] rounded-full flex items-center justify-center text-lg font-semibold text-[#7A4B52]">
                  {userInitial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#7A4B52]">{user.email}</p>
                  <p className="text-xs text-[#6E5A5D]">{user.role === "ADMIN" ? "Administrador" : "Cliente"}</p>
                </div>
              </div>
            </div>
            {sidebarItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeSection === id
                    ? "bg-[#D97D93] text-white"
                    : "text-[#6E5A5D] hover:bg-[#FCEEEF] hover:text-[#7A4B52]"
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#D64F4F] hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut size={16} /> Sair
            </button>
          </aside>

          <div className="lg:col-span-3">
            {activeSection === "pedidos" && (
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52] mb-6">
                  Meus Pedidos
                </h2>
                {loadingOrders ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-[#D97D93]" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <ShoppingBag size={48} className="text-[#F2DCDD]" />
                    <p className="text-[#6E5A5D]">Voce ainda nao realizou nenhum pedido</p>
                    <Link
                      href="/category"
                      className="h-10 px-6 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center"
                    >
                      Explorar Produtos
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const statusInfo = statusLabels[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };
                      const isExpanded = expandedOrder === order.id;
                      return (
                        <div
                          key={order.id}
                          className="bg-white border border-[#F2DCDD] rounded-[18px] p-5"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm font-semibold text-[#7A4B52]">
                                #{order.id.substring(0, 8).toUpperCase()}
                              </p>
                              <p className="text-xs text-[#6E5A5D]">
                                {new Date(order.createdAt).toLocaleDateString("pt-BR")} · {order.items.length} item(s)
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                              <span className="text-sm font-semibold text-[#7A4B52]">
                                R${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-3 border-t border-[#F2DCDD]">
                            <button
                              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                              className="text-xs text-[#D97D93] hover:underline"
                            >
                              {isExpanded ? "Ocultar detalhes" : "Ver detalhes"}
                            </button>
                            {order.trackingCode && (
                              <span className="text-xs text-[#6E5A5D]">
                                Rastreio: {order.trackingCode}
                              </span>
                            )}
                          </div>

                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-[#F2DCDD] space-y-3">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-[#FCEEEF] rounded-lg flex-shrink-0 overflow-hidden">
                                    {item.productImage ? (
                                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[#D97D93] text-xs">?</div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#7A4B52] truncate">{item.productName}</p>
                                    <p className="text-xs text-[#6E5A5D]">Qtd: {item.quantity} × R${item.unitPrice.toFixed(2)}</p>
                                  </div>
                                  <p className="text-sm font-semibold text-[#7A4B52]">
                                    R${(item.unitPrice * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                              <div className="pt-3 border-t border-[#F2DCDD] space-y-1">
                                <div className="flex justify-between text-xs text-[#6E5A5D]">
                                  <span>Subtotal</span>
                                  <span>R${order.subtotal.toFixed(2)}</span>
                                </div>
                                {order.discount > 0 && (
                                  <div className="flex justify-between text-xs text-[#3E8B5A]">
                                    <span>Desconto</span>
                                    <span>-R${order.discount.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-xs text-[#6E5A5D]">
                                  <span>Frete</span>
                                  <span>{order.shippingCost === 0 ? "Gratis" : `R$${order.shippingCost.toFixed(2)}`}</span>
                                </div>
                                {order.paymentMethod && (
                                  <div className="flex justify-between text-xs text-[#6E5A5D]">
                                    <span>Pagamento</span>
                                    <span>{order.paymentMethod === "PIX" ? "PIX" : order.paymentMethod === "card" ? "Cartao de Credito" : order.paymentMethod}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeSection === "enderecos" && (
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52] mb-6">
                  Enderecos
                </h2>
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-16 h-16 bg-[#FCEEEF] rounded-full flex items-center justify-center">
                    <MapPin size={24} className="text-[#D97D93]" />
                  </div>
                  <p className="text-sm text-[#6E5A5D]">Gerencie seus enderecos de entrega</p>
                  <p className="text-xs text-[#6E5A5D]">Os enderecos sao cadastrados durante o checkout</p>
                </div>
              </div>
            )}

            {activeSection === "dados" && (
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52] mb-6">
                  Dados Pessoais
                </h2>
                <div className="bg-white border border-[#F2DCDD] rounded-[18px] p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#7A4B52] mb-2">E-mail</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm text-[#6E5A5D] bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#7A4B52] mb-2">Funcao</label>
                    <input
                      type="text"
                      value={user.role === "ADMIN" ? "Administrador" : "Cliente"}
                      disabled
                      className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm text-[#6E5A5D] bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
