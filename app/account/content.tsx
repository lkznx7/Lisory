"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  User,
  LogOut,
  Loader2,
  ShoppingBag,
  Lock,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
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

interface UserAddress {
  id: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: "Aguardando Pagamento", color: "bg-amber-100 text-amber-700" },
  PAGO: { label: "Pago", color: "bg-blue-100 text-blue-700" },
  PROCESSANDO: { label: "Processando", color: "bg-purple-100 text-purple-700" },
  ENVIADO: { label: "Enviado", color: "bg-indigo-100 text-indigo-700" },
  ENTREGUE: { label: "Entregue", color: "bg-emerald-100 text-emerald-700" },
  CANCELADO: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

const sidebarItems = [
  { id: "pedidos", label: "Meus Pedidos", icon: Package },
  { id: "enderecos", label: "Endereços", icon: MapPin },
  { id: "dados", label: "Dados Pessoais", icon: User },
  { id: "seguranca", label: "Segurança", icon: Lock },
];

export function AccountPageContent() {
  const [activeSection, setActiveSection] = useState("pedidos");
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Orders State
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Addresses State
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Address Form State
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [loadingAddressAction, setLoadingAddressAction] = useState(false);

  // Profile Form State
  const [profileEmail, setProfileEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      setProfileEmail(user.email);
    }
  }, [user, authLoading, router]);

  // Load Orders
  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoadingOrders(true);
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
  }, [user]);

  // Load Addresses
  const loadAddresses = useCallback(async () => {
    if (!user) return;
    setLoadingAddresses(true);
    try {
      const data = await api.get<UserAddress[]>("/api/user/addresses");
      setAddresses(data);
    } catch {
      toast.error("Erro ao carregar endereços");
    } finally {
      setLoadingAddresses(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (activeSection === "pedidos") {
        loadOrders();
      } else if (activeSection === "enderecos") {
        loadAddresses();
      }
    }
  }, [user, activeSection, loadOrders, loadAddresses]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Address Actions
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !number.trim() || !neighborhood.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    setLoadingAddressAction(true);
    const payload = {
      street: street.trim(),
      number: number.trim(),
      complement: complement.trim() || null,
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      state: state.trim().toUpperCase(),
      zipCode: zipCode.replace(/\D/g, ""),
      country: "Brasil",
      isDefault,
    };

    try {
      if (editingAddressId) {
        await api.put(`/api/user/addresses/${editingAddressId}`, payload);
        toast.success("Endereço atualizado com sucesso");
      } else {
        await api.post("/api/user/addresses", payload);
        toast.success("Endereço cadastrado com sucesso");
      }
      resetAddressForm();
      await loadAddresses();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar endereço");
    } finally {
      setLoadingAddressAction(false);
    }
  };

  const handleEditAddress = (addr: UserAddress) => {
    setEditingAddressId(addr.id);
    setStreet(addr.street);
    setNumber(addr.number);
    setComplement(addr.complement || "");
    setNeighborhood(addr.neighborhood);
    setCity(addr.city);
    setState(addr.state);
    setZipCode(addr.zipCode);
    setIsDefault(addr.isDefault);
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Deseja realmente excluir este endereço?")) return;
    try {
      await api.delete(`/api/user/addresses/${id}`);
      toast.success("Endereço excluído com sucesso");
      await loadAddresses();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir endereço");
    }
  };

  const resetAddressForm = () => {
    setIsAddingAddress(false);
    setEditingAddressId(null);
    setStreet("");
    setNumber("");
    setComplement("");
    setNeighborhood("");
    setCity("");
    setState("");
    setZipCode("");
    setIsDefault(false);
  };

  const handleCepLookup = async (val: string) => {
    const cep = val.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const resJson = await res.json();
      if (!resJson.erro) {
        setStreet(resJson.logradouro || "");
        setNeighborhood(resJson.bairro || "");
        setCity(resJson.localidade || "");
        setState(resJson.uf || "");
      }
    } catch {
      // Ignora erro de busca
    }
  };

  // Profile actions
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileEmail.trim()) {
      toast.error("O e-mail não pode ficar em branco");
      return;
    }
    setSavingProfile(true);
    try {
      await api.put("/auth/profile", { email: profileEmail.trim() });
      toast.success("Perfil atualizado com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar dados");
    } finally {
      setSavingProfile(false);
    }
  };

  // Security actions
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("A nova senha deve ter no mínimo 8 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não conferem");
      return;
    }
    setSavingPassword(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao alterar senha");
    } finally {
      setSavingPassword(false);
    }
  };

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
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#7A4B52] truncate">{user.email}</p>
                  <p className="text-xs text-[#6E5A5D]">
                    {user.role === "ADMIN" ? "Administrador" : "Cliente"}
                  </p>
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
                  <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white border border-[#F2DCDD] rounded-[18px]">
                    <ShoppingBag size={48} className="text-[#F2DCDD]" />
                    <p className="text-[#6E5A5D]">Você ainda não realizou nenhum pedido</p>
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
                      const statusInfo = statusLabels[order.status] || {
                        label: order.status,
                        color: "bg-gray-100 text-gray-700",
                      };
                      const isExpanded = expandedOrder === order.id;
                      return (
                        <div
                          key={order.id}
                          className="bg-white border border-[#F2DCDD] rounded-[18px] p-5 shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div>
                              <p className="text-sm font-semibold text-[#7A4B52]">
                                #{order.id.substring(0, 8).toUpperCase()}
                              </p>
                              <p className="text-xs text-[#6E5A5D]">
                                {new Date(order.createdAt).toLocaleDateString("pt-BR")} · {order.items.length} item(s)
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                              >
                                {statusInfo.label}
                              </span>
                              <span className="text-sm font-semibold text-[#7A4B52]">
                                R$ {order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-3 border-t border-[#F2DCDD]">
                            <button
                              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                              className="text-xs text-[#D97D93] hover:underline font-medium"
                            >
                              {isExpanded ? "Ocultar detalhes" : "Ver detalhes"}
                            </button>
                            {order.trackingCode && (
                              <span className="text-xs text-[#6E5A5D]">
                                Rastreio: <strong className="text-[#7A4B52]">{order.trackingCode}</strong>
                              </span>
                            )}
                          </div>

                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-[#F2DCDD] space-y-3">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-[#FCEEEF] rounded-lg flex-shrink-0 overflow-hidden">
                                    {item.productImage ? (
                                      <img
                                        src={item.productImage}
                                        alt={item.productName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[#D97D93] text-xs">
                                        ?
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#7A4B52] truncate">
                                      {item.productName}
                                    </p>
                                    <p className="text-xs text-[#6E5A5D]">
                                      Qtd: {item.quantity} × R$ {item.unitPrice.toFixed(2)}
                                    </p>
                                  </div>
                                  <p className="text-sm font-semibold text-[#7A4B52]">
                                    R$ {(item.unitPrice * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                              <div className="pt-3 border-t border-[#F2DCDD] space-y-1 text-xs">
                                <div className="flex justify-between text-[#6E5A5D]">
                                  <span>Subtotal</span>
                                  <span>R$ {order.subtotal.toFixed(2)}</span>
                                </div>
                                {order.discount > 0 && (
                                  <div className="flex justify-between text-[#3E8B5A] font-medium">
                                    <span>Desconto</span>
                                    <span>-R$ {order.discount.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-[#6E5A5D]">
                                  <span>Frete</span>
                                  <span>
                                    {order.shippingCost === 0 ? "Grátis" : `R$ ${order.shippingCost.toFixed(2)}`}
                                  </span>
                                </div>
                                {order.paymentMethod && (
                                  <div className="flex justify-between text-[#6E5A5D]">
                                    <span>Forma de Pagamento</span>
                                    <span className="font-medium text-[#7A4B52]">
                                      {order.paymentMethod === "PIX"
                                        ? "PIX"
                                        : order.paymentMethod === "card"
                                          ? "Cartão de Crédito"
                                          : order.paymentMethod}
                                    </span>
                                  </div>
                                )}
                                {order.addressSummary && (
                                  <div className="text-[#6E5A5D] pt-2 mt-2 border-t border-dashed">
                                    <p className="font-semibold mb-0.5">Endereço de Entrega:</p>
                                    <p>{order.addressSummary}</p>
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52]">
                    Endereços de Entrega
                  </h2>
                  {!isAddingAddress && (
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="h-10 px-4 bg-[#D97D93] hover:bg-[#C8667F] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
                    >
                      <Plus size={14} /> Novo Endereço
                    </button>
                  )}
                </div>

                {isAddingAddress ? (
                  <form
                    onSubmit={handleAddressSubmit}
                    className="bg-white border border-[#F2DCDD] rounded-[18px] p-6 space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#F2DCDD]">
                      <h3 className="font-medium text-[#7A4B52]">
                        {editingAddressId ? "Editar Endereço" : "Cadastrar Novo Endereço"}
                      </h3>
                      <button
                        type="button"
                        onClick={resetAddressForm}
                        className="text-[#6E5A5D] hover:text-[#7A4B52]"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#7A4B52] mb-1.5">CEP *</label>
                        <input
                          type="text"
                          required
                          maxLength={9}
                          placeholder="00000-000"
                          value={zipCode}
                          onChange={(e) => {
                            setZipCode(e.target.value);
                            handleCepLookup(e.target.value);
                          }}
                          className="w-full h-11 px-3 border border-[#F2DCDD] rounded-xl text-sm outline-none focus:border-[#D97D93] transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#7A4B52] mb-1.5">Rua *</label>
                        <input
                          type="text"
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          className="w-full h-11 px-3 border border-[#F2DCDD] rounded-xl text-sm outline-none focus:border-[#D97D93] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#7A4B52] mb-1.5">Número *</label>
                        <input
                          type="text"
                          required
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          className="w-full h-11 px-3 border border-[#F2DCDD] rounded-xl text-sm outline-none focus:border-[#D97D93] transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#7A4B52] mb-1.5">Complemento</label>
                        <input
                          type="text"
                          value={complement}
                          onChange={(e) => setComplement(e.target.value)}
                          className="w-full h-11 px-3 border border-[#F2DCDD] rounded-xl text-sm outline-none focus:border-[#D97D93] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#7A4B52] mb-1.5">Bairro *</label>
                        <input
                          type="text"
                          required
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          className="w-full h-11 px-3 border border-[#F2DCDD] rounded-xl text-sm outline-none focus:border-[#D97D93] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#7A4B52] mb-1.5">Cidade *</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full h-11 px-3 border border-[#F2DCDD] rounded-xl text-sm outline-none focus:border-[#D97D93] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#7A4B52] mb-1.5">Estado (UF) *</label>
                        <input
                          type="text"
                          required
                          maxLength={2}
                          placeholder="SP"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full h-11 px-3 border border-[#F2DCDD] rounded-xl text-sm outline-none focus:border-[#D97D93] transition-colors"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 pt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                        className="rounded border-[#F2DCDD] text-[#D97D93] focus:ring-[#D97D93]"
                      />
                      <span className="text-xs font-medium text-[#6E5A5D]">
                        Definir como endereço padrão de entrega
                      </span>
                    </label>

                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={resetAddressForm}
                        className="h-11 px-5 border border-[#F2DCDD] text-sm font-semibold rounded-xl text-[#6E5A5D] hover:bg-[#FCEEEF]"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loadingAddressAction}
                        className="h-11 px-6 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                      >
                        {loadingAddressAction ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          "Salvar Endereço"
                        )}
                      </button>
                    </div>
                  </form>
                ) : loadingAddresses ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-[#D97D93]" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white border border-[#F2DCDD] rounded-[18px]">
                    <MapPin size={48} className="text-[#F2DCDD]" />
                    <p className="text-sm text-[#6E5A5D]">Nenhum endereço cadastrado</p>
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="h-10 px-6 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      Cadastrar Primeiro Endereço
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`bg-white border rounded-[18px] p-5 relative flex flex-col justify-between shadow-sm transition-all ${
                          addr.isDefault ? "border-[#D97D93] ring-1 ring-[#D97D93]/30" : "border-[#F2DCDD]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-sm font-semibold text-[#7A4B52]">
                              {addr.street}, {addr.number}
                            </span>
                            {addr.isDefault && (
                              <span className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                                <Check size={10} /> Padrão
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#6E5A5D]">
                            {addr.complement && `${addr.complement} · `}
                            {addr.neighborhood}
                          </p>
                          <p className="text-xs text-[#6E5A5D] mt-0.5">
                            {addr.city} - {addr.state} · CEP {addr.zipCode}
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#FFF1F2]">
                          <button
                            onClick={() => handleEditAddress(addr)}
                            className="text-xs text-[#6E5A5D] hover:text-[#D97D93] font-medium flex items-center gap-1"
                          >
                            <Edit2 size={12} /> Editar
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-xs text-[#D64F4F] hover:text-[#B71C1C] font-medium flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "dados" && (
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52] mb-6">
                  Dados Pessoais
                </h2>
                <form
                  onSubmit={handleProfileSubmit}
                  className="bg-white border border-[#F2DCDD] rounded-[18px] p-6 space-y-4 shadow-sm"
                >
                  <div>
                    <label className="block text-xs font-semibold text-[#7A4B52] mb-2">
                      E-mail da Conta
                    </label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm text-[#7A4B52] outline-none focus:border-[#D97D93] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#7A4B52] mb-2">Função</label>
                    <input
                      type="text"
                      value={user.role === "ADMIN" ? "Administrador" : "Cliente"}
                      disabled
                      className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm text-[#6E5A5D] bg-gray-50 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="h-11 px-6 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                    >
                      {savingProfile ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        "Salvar Alterações"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === "seguranca" && (
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52] mb-6">
                  Segurança e Senha
                </h2>
                <form
                  onSubmit={handlePasswordSubmit}
                  className="bg-white border border-[#F2DCDD] rounded-[18px] p-6 space-y-4 shadow-sm"
                >
                  <div>
                    <label className="block text-xs font-semibold text-[#7A4B52] mb-2">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Sua senha atual"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm outline-none focus:border-[#D97D93] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#7A4B52] mb-2">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="Mínimo 8 caracteres"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm outline-none focus:border-[#D97D93] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#7A4B52] mb-2">
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="Repita a nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm outline-none focus:border-[#D97D93] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="h-11 px-6 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                    >
                      {savingPassword ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        "Alterar Senha"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
