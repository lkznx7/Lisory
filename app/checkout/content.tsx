"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Check, Loader2, Store, MessageCircle, Info } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { shippingService } from "@/services/shipping.service";
import { ShippingOption } from "@/types";
import { SITE, WHATSAPP_MESSAGE, DELIVERY_METHODS } from "@/constants";

const steps = ["Identificacao", "Endereco", "Entrega", "Pagamento"];

interface CheckoutData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCpf: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: string;
}

interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

function validateStep(step: number, data: CheckoutData, deliveryType: "delivery" | "pickup"): string | null {
  switch (step) {
    case 1:
      if (!data.guestName.trim()) return "Nome e obrigatorio";
      if (!data.guestEmail.trim()) return "E-mail e obrigatorio";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.guestEmail)) return "E-mail invalido";
      if (!data.guestCpf.trim()) return "CPF e obrigatorio";
      if (!/^[\d.-]+$/.test(data.guestCpf.replace(/[^\d]/g, ""))) return "CPF invalido";
      if (data.guestCpf.replace(/\D/g, "").length !== 11) return "CPF deve ter 11 digitos";
      if (!data.guestPhone.trim()) return "Telefone e obrigatorio";
      return null;
    case 2:
      if (deliveryType === "pickup") return null;
      if (!data.zipCode.trim()) return "CEP e obrigatorio";
      if (data.zipCode.replace(/\D/g, "").length !== 8) return "CEP deve ter 8 digitos";
      if (!data.street.trim()) return "Rua e obrigatoria";
      if (!data.number.trim()) return "Numero e obrigatorio";
      if (!data.neighborhood.trim()) return "Bairro e obrigatorio";
      if (!data.city.trim()) return "Cidade e obrigatoria";
      if (!data.state.trim()) return "Estado e obrigatorio";
      if (data.state.length !== 2) return "Estado deve ter 2 letras";
      return null;
    case 3:
      return null;
    case 4:
      return null;
    default:
      return null;
  }
}

export function CheckoutPageContent() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [data, setData] = useState<CheckoutData>({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestCpf: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "PIX",
  });

  const updateField = (field: keyof CheckoutData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateFreight = useCallback(async (zipCode: string) => {
    if (!zipCode || zipCode.length !== 8) return;
    setLoadingShipping(true);
    try {
      const freightItems = items.map((item) => ({
        productId: item.id,
        quantity: item.qty,
        weight: 0.5,
        width: 15,
        height: 5,
        length: 20,
      }));
      const options = await shippingService.calculateFreight({ zipCode, items: freightItems });
      setShippingOptions(options);
      if (options.length > 0) {
        setSelectedShipping(options[0]);
      }
    } catch {
      setShippingOptions([]);
      toast.error("Erro ao calcular frete. Tente novamente.");
    } finally {
      setLoadingShipping(false);
    }
  }, [items]);

  useEffect(() => {
    if (data.zipCode && data.zipCode.length === 8 && deliveryType === "delivery") {
      const timeoutId = setTimeout(() => {
        calculateFreight(data.zipCode);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [data.zipCode, calculateFreight, deliveryType]);

  const handleCepBlur = async (value: string) => {
    const cep = value.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dataCep: ViaCepResponse = await res.json();
      if (!dataCep.erro) {
        setData((prev) => ({
          ...prev,
          street: dataCep.logradouro || prev.street,
          neighborhood: dataCep.bairro || prev.neighborhood,
          city: dataCep.localidade || prev.city,
          state: dataCep.uf || prev.state,
        }));
      }
    } catch {
      // ViaCEP lookup failed silently
    }
  };

  const handleNext = () => {
    const error = validateStep(step, data, deliveryType);
    if (error) {
      toast.error(error);
      return;
    }
    if (step === 2 && deliveryType === "pickup") {
      setSelectedShipping({
        carrier: DELIVERY_METHODS.PICKUP,
        service: "Retirada",
        cost: 0,
        estimatedDays: 0,
      });
      setStep(4);
      return;
    }
    if (step === 3 && !selectedShipping) {
      toast.error("Selecione uma opcao de entrega para continuar");
      return;
    }
    if (step === 3 && selectedShipping?.carrier === DELIVERY_METHODS.UBER_FLASH) {
      toast.info("Ao finalizar, combinaremos a entrega via WhatsApp.");
    }
    setStep(step + 1);
  };

  const handleFinish = async () => {
    if (items.length === 0) {
      toast.error("Seu carrinho esta vazio");
      return;
    }

    const paymentError = validateStep(4, data, deliveryType);
    if (paymentError) {
      toast.error(paymentError);
      return;
    }

    setLoading(true);
    try {
      const isPickup = selectedShipping?.carrier === DELIVERY_METHODS.PICKUP;
      const isUberFlash = selectedShipping?.carrier === DELIVERY_METHODS.UBER_FLASH;

      const orderPayload = {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestCpf: data.guestCpf.replace(/\D/g, ""),
        guestPhone: data.guestPhone,
        street: isPickup ? null : data.street,
        number: isPickup ? null : data.number,
        complement: isPickup ? null : (data.complement || null),
        neighborhood: isPickup ? null : data.neighborhood,
        city: isPickup ? null : data.city,
        state: isPickup ? null : data.state,
        zipCode: isPickup ? null : data.zipCode.replace(/\D/g, ""),
        paymentMethod: data.paymentMethod,
        shippingCarrier: selectedShipping?.carrier || null,
        shippingService: selectedShipping?.service || null,
        shippingCost: selectedShipping?.cost || 0,
      };

      const result = await api.post<{ id: string; paymentId?: string; paymentStatus?: string; invoiceUrl?: string }>("/orders/public", orderPayload);



      if (!result.invoiceUrl) {
        toast.error("Erro ao gerar link de pagamento. Tente novamente.");
        setLoading(false);
        return;
      }

      await clearCart();
      window.location.href = result.invoiceUrl;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao finalizar pedido");
    } finally {
      setLoading(false);
    }
  };

  const isPickup = selectedShipping?.carrier === DELIVERY_METHODS.PICKUP;
  const isUberFlash = selectedShipping?.carrier === DELIVERY_METHODS.UBER_FLASH;
  const shippingCost = selectedShipping?.cost || 0;
  const total = totalPrice + shippingCost;

  return (
    <main className="pt-[72px] sm:pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8]">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 sm:py-10">
        <div className="flex items-center mb-6 sm:mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    i + 1 < step
                      ? "bg-[#3E8B5A] text-white"
                      : i + 1 === step
                        ? "bg-[#D97D93] text-white"
                        : "bg-[#F2DCDD] text-[#6E5A5D]"
                  }`}
                >
                  {i + 1 < step ? <Check size={12} /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    i + 1 === step ? "text-[#7A4B52]" : "text-[#6E5A5D]"
                  }`}
                >
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 ${
                    i + 1 < step ? "bg-[#3E8B5A]" : "bg-[#F2DCDD]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-light text-[#7A4B52] mb-4 sm:mb-6">
                  Identificacao
                </h2>
                <p className="text-sm text-[#6E5A5D] mb-3 sm:mb-4">
                  Preencha seus dados para continuar. Voce tambem pode comprar como visitante.
                </p>
                <div className="grid gap-4">
                  {[
                    { label: "Nome completo", field: "guestName" as const, placeholder: "Ana Silva" },
                    { label: "E-mail", field: "guestEmail" as const, placeholder: "ana@email.com", type: "email" },
                    { label: "CPF", field: "guestCpf" as const, placeholder: "000.000.000-00" },
                    { label: "Telefone", field: "guestPhone" as const, placeholder: "(11) 99999-9999" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs font-semibold text-[#7A4B52] mb-2 tracking-wide">
                        {field.label}
                      </label>
                      <input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        value={data[field.field]}
                        onChange={(e) => updateField(field.field, e.target.value)}
                        maxLength={field.field === "guestName" ? 255 : field.field === "guestEmail" ? 255 : field.field === "guestCpf" ? 14 : 20}
                        className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm text-[#7A4B52] placeholder-[#6E5A5D] outline-none focus:border-[#D97D93] transition-colors bg-white"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-light text-[#7A4B52] mb-4 sm:mb-6">
                  Opcao de Entrega
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("delivery")}
                    className={`p-4 border rounded-[14px] text-left transition-all ${
                      deliveryType === "delivery"
                        ? "border-[#D97D93] bg-[#FCEEEF]"
                        : "border-[#F2DCDD] bg-white hover:border-[#C98A96]"
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#7A4B52]">Receber no endereco</p>
                    <p className="text-xs text-[#6E5A5D] mt-0.5">Enviaremos por transportadora ou Uber Flash</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryType("pickup");
                      setSelectedShipping({
                        carrier: DELIVERY_METHODS.PICKUP,
                        service: "Retirada",
                        cost: 0,
                        estimatedDays: 0,
                      });
                    }}
                    className={`p-4 border rounded-[14px] text-left transition-all ${
                      deliveryType === "pickup"
                        ? "border-[#D97D93] bg-[#FCEEEF]"
                        : "border-[#F2DCDD] bg-white hover:border-[#C98A96]"
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#7A4B52]">Retirar no Local</p>
                    <p className="text-xs text-[#6E5A5D] mt-0.5">Retire pessoalmente de forma gratuita</p>
                  </button>
                </div>

                {deliveryType === "delivery" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "CEP", field: "zipCode" as const, placeholder: "00000000", full: false },
                      { label: "Rua", field: "street" as const, placeholder: "Nome da rua", full: true },
                      { label: "Numero", field: "number" as const, placeholder: "123", full: false },
                      { label: "Complemento", field: "complement" as const, placeholder: "Apto, Sala...", full: false },
                      { label: "Bairro", field: "neighborhood" as const, placeholder: "Bairro", full: false },
                      { label: "Cidade", field: "city" as const, placeholder: "Cidade", full: false },
                      { label: "Estado", field: "state" as const, placeholder: "SP", full: false },
                    ].map((field) => (
                      <div key={field.label} className={field.full ? "sm:col-span-2" : ""}>
                        <label className="block text-xs font-semibold text-[#7A4B52] mb-2">{field.label}</label>
                        <input
                          placeholder={field.placeholder}
                          value={data[field.field]}
                          onChange={(e) => updateField(field.field, e.target.value)}
                          onBlur={field.field === "zipCode" ? (e) => handleCepBlur(e.target.value) : undefined}
                          maxLength={field.field === "zipCode" ? 8 : field.field === "street" ? 255 : field.field === "number" ? 10 : field.field === "complement" ? 100 : field.field === "neighborhood" ? 100 : field.field === "city" ? 100 : 2}
                          className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm text-[#7A4B52] placeholder-[#6E5A5D] outline-none focus:border-[#D97D93] transition-colors bg-white"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-5 bg-[#E8F5E9] rounded-[14px] text-sm text-[#2E7D32]">
                    <Store size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Informacoes para Retirada</p>
                      <p className="text-xs text-[#388E3C] leading-relaxed">
                        Voce optou por retirar seu pedido diretamente no local. Nao e necessario preencher dados de endereco.
                        Clique em continuar para prosseguir para o pagamento.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-light text-[#7A4B52] mb-4 sm:mb-6">
                  Opcoes de Entrega
                </h2>

                {loadingShipping ? (
                  <div className="flex items-center gap-2 text-[#6E5A5D]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calculando frete...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {shippingOptions.length > 0 && (
                      <>
                        <p className="text-xs font-semibold text-[#6E5A5D] uppercase tracking-wider">
                          Enviar por transportadora
                        </p>
                        {shippingOptions.map((option, index) => (
                          <label
                            key={`carrier-${index}`}
                            className={`flex items-center justify-between p-4 border rounded-[14px] cursor-pointer transition-colors ${
                              selectedShipping?.carrier === option.carrier && selectedShipping?.service === option.service
                                ? "border-[#D97D93] bg-[#FCEEEF]"
                                : "border-[#F2DCDD] hover:border-[#C98A96]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shipping"
                                checked={
                                  selectedShipping?.carrier === option.carrier &&
                                  selectedShipping?.service === option.service
                                }
                                onChange={() => setSelectedShipping(option)}
                                className="text-[#D97D93]"
                              />
                              <div>
                                <p className="text-sm font-semibold text-[#7A4B52]">
                                  {option.service && !option.service.startsWith(".") ? option.service : option.carrier}
                                </p>
                                <p className="text-xs text-[#6E5A5D] mt-0.5">
                                  Prazo estimado: {option.estimatedDays} dias uteis
                                </p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-[#7A4B52]">
                              {option.cost === 0 ? (
                                <span className="text-[#3E8B5A]">Gratis</span>
                              ) : (
                                `R$ ${option.cost.toFixed(2).replace(".", ",")}`
                              )}
                            </p>
                          </label>
                        ))}
                        <div className="border-t border-[#F2DCDD] my-2" />
                      </>
                    )}

                    <p className="text-xs font-semibold text-[#6E5A5D] uppercase tracking-wider">
                      Outras opcoes
                    </p>

                    <label
                      className={`flex items-center justify-between p-4 border rounded-[14px] cursor-pointer transition-colors ${
                        selectedShipping?.carrier === DELIVERY_METHODS.PICKUP
                          ? "border-[#D97D93] bg-[#FCEEEF]"
                          : "border-[#F2DCDD] hover:border-[#C98A96]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShipping?.carrier === DELIVERY_METHODS.PICKUP}
                          onChange={() => setSelectedShipping({
                            carrier: DELIVERY_METHODS.PICKUP,
                            service: "Retirada",
                            cost: 0,
                            estimatedDays: 0,
                          })}
                          className="text-[#D97D93]"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#7A4B52] flex items-center gap-2">
                            <Store size={16} />
                            {DELIVERY_METHODS.PICKUP}
                          </p>
                          <p className="text-xs text-[#6E5A5D] mt-0.5">
                            Retire seu pedido diretamente no estabelecimento
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[#3E8B5A]">Gratis</p>
                    </label>

                    {selectedShipping?.carrier === DELIVERY_METHODS.PICKUP && (
                      <div className="flex items-start gap-2 p-3 bg-[#E8F5E9] rounded-[12px] text-xs text-[#2E7D32]">
                        <Info size={14} className="mt-0.5 flex-shrink-0" />
                        <span>
                          Seu pedido sera preparado para retirada no estabelecimento. Voce recebera um e-mail quando estiver pronto.
                        </span>
                      </div>
                    )}

                    <label
                      className={`flex items-center justify-between p-4 border rounded-[14px] cursor-pointer transition-colors ${
                        selectedShipping?.carrier === DELIVERY_METHODS.UBER_FLASH
                          ? "border-[#D97D93] bg-[#FCEEEF]"
                          : "border-[#F2DCDD] hover:border-[#C98A96]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShipping?.carrier === DELIVERY_METHODS.UBER_FLASH}
                          onChange={() => setSelectedShipping({
                            carrier: DELIVERY_METHODS.UBER_FLASH,
                            service: "Uber Flash",
                            cost: 0,
                            estimatedDays: 0,
                          })}
                          className="text-[#D97D93]"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#7A4B52]">
                            {DELIVERY_METHODS.UBER_FLASH}
                          </p>
                          <p className="text-xs text-[#6E5A5D] mt-0.5">
                            Entrega rapida - valor combinado com a loja
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[#6E5A5D]">A combinar</p>
                    </label>

                    {selectedShipping?.carrier === DELIVERY_METHODS.UBER_FLASH && (
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 p-3 bg-[#FFF3E0] rounded-[12px] text-xs text-[#E65100]">
                          <Info size={14} className="mt-0.5 flex-shrink-0" />
                          <span>
                            O valor da entrega via Uber Flash sera combinado diretamente com a loja pelo WhatsApp apos a confirmacao do pedido.
                          </span>
                        </div>
                      </div>
                    )}

                    {!loadingShipping && shippingOptions.length === 0 && selectedShipping === null && (
                      <div className="text-center py-4 text-[#6E5A5D] text-xs">
                        <p>Informe o CEP no endereco para ver opcoes de transportadora</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-light text-[#7A4B52] mb-4 sm:mb-6">
                  Pagamento
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {[
                    { id: "pix", label: "PIX", desc: "Aprovacao instantanea" },
                    { id: "card", label: "Cartao de Credito", desc: "Ate 12x sem juros" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => updateField("paymentMethod", m.id)}
                      className={`p-4 border rounded-[14px] text-left transition-all ${
                        data.paymentMethod === m.id
                          ? "border-[#D97D93] bg-[#FCEEEF]"
                          : "border-[#F2DCDD] bg-white hover:border-[#C98A96]"
                      }`}
                    >
                      <p className="text-sm font-semibold text-[#7A4B52]">{m.label}</p>
                      <p className="text-xs text-[#6E5A5D] mt-0.5">{m.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="bg-[#FCEEEF] rounded-[18px] p-6 text-center">
                  <p className="text-sm text-[#6E5A5D]">
                    Voce sera redirecionado para a pagina de pagamento segura apos confirmar o pedido.
                  </p>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step === 4 && deliveryType === "pickup" ? 2 : step - 1)}
                  className="h-12 px-6 border border-[#F2DCDD] text-sm text-[#6E5A5D] hover:border-[#D97D93] hover:text-[#D97D93] rounded-xl transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={16} /> Voltar
                </button>
              ) : (
                <button
                  onClick={() => router.push("/cart")}
                  className="h-12 px-6 border border-[#F2DCDD] text-sm text-[#6E5A5D] hover:border-[#D97D93] hover:text-[#D97D93] rounded-xl transition-colors"
                >
                  Voltar ao Carrinho
                </button>
              )}
              <button
                onClick={() => (step < 4 ? handleNext() : handleFinish())}
                disabled={loading}
                className="h-12 px-8 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? "Processando..." : step === 4 ? (isUberFlash ? "Finalizar e Falar no WhatsApp" : "Finalizar Pedido") : "Continuar"}{" "}
                {!loading && <ChevronRight size={16} />}
              </button>
            </div>
          </div>

          <div>
            <div className="bg-white border border-[#F2DCDD] rounded-[18px] p-6 sticky top-28">
              <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#7A4B52] mb-5">
                Resumo do Pedido
              </h3>
              <div className="space-y-4 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-[10px] bg-[#FCEEEF]" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6E5A5D] text-white text-[10px] rounded-full flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-[#7A4B52] leading-snug">{item.name}</p>
                      <p className="text-xs text-[#D97D93] font-semibold mt-0.5">R${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#F2DCDD] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E5A5D]">Subtotal</span>
                  <span>R${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6E5A5D]">Frete</span>
                  <span className={shippingCost === 0 && selectedShipping ? "text-[#3E8B5A] font-medium" : "text-[#7A4B52] font-medium"}>
                    {selectedShipping
                      ? isPickup
                        ? "Gratis (Retirada)"
                        : isUberFlash
                          ? "A combinar"
                          : shippingCost === 0
                            ? "Gratis"
                            : `R$ ${shippingCost.toFixed(2)}`
                      : "A calcular"}
                  </span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-[#F2DCDD]">
                  <span>Total</span>
                  <span className="text-[#D97D93]">R${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
