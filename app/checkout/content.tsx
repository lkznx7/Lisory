"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Check, Truck, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { shippingService } from "@/services/shipping.service";
import { ShippingOption } from "@/types";

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

export function CheckoutPageContent() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
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

  const calculateFreight = async (zipCode: string) => {
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
    } catch (error) {
      console.error("Error calculating freight:", error);
      setShippingOptions([{ carrier: "PAC", service: "PAC", cost: 0, estimatedDays: 10 }]);
    } finally {
      setLoadingShipping(false);
    }
  };

  useEffect(() => {
    if (data.zipCode && data.zipCode.length === 8) {
      calculateFreight(data.zipCode);
    }
  }, [data.zipCode]);

  const handleFinish = async () => {
    if (items.length === 0) {
      toast.error("Seu carrinho esta vazio");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        paymentMethod: data.paymentMethod === "pix" ? "PIX" : data.paymentMethod === "card" ? "CARTAO" : "BOLETO",
        guestName: data.guestName || undefined,
        guestEmail: data.guestEmail || undefined,
        guestPhone: data.guestPhone || undefined,
        guestCpf: data.guestCpf || undefined,
        street: data.street || undefined,
        number: data.number || undefined,
        complement: data.complement || undefined,
        neighborhood: data.neighborhood || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        zipCode: data.zipCode || undefined,
        shippingCarrier: selectedShipping?.carrier || undefined,
        shippingService: selectedShipping?.service || undefined,
        shippingCost: selectedShipping?.cost || 0,
      };

      const result = await api.post<{ id: string; paymentLink?: string }>("/orders/public", orderData);
      await clearCart();
      toast.success("Pedido realizado com sucesso!");

      if (result.paymentLink) {
        window.location.href = result.paymentLink;
      } else {
        router.push(`/confirmation?orderId=${result.id}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao finalizar pedido");
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = selectedShipping?.cost || 0;
  const total = totalPrice + shippingCost;

  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8]">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10">
        <div className="flex items-center mb-12">
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

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52] mb-6">
                  Identificacao
                </h2>
                <p className="text-sm text-[#6E5A5D] mb-4">
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
                        className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm text-[#7A4B52] placeholder-[#6E5A5D] outline-none focus:border-[#D97D93] transition-colors bg-white"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52] mb-6">
                  Endereco de Entrega
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "CEP", field: "zipCode" as const, placeholder: "00000-000", full: false },
                    { label: "Rua", field: "street" as const, placeholder: "Nome da rua", full: true },
                    { label: "Numero", field: "number" as const, placeholder: "123", full: false },
                    { label: "Complemento", field: "complement" as const, placeholder: "Apto, Sala...", full: false },
                    { label: "Bairro", field: "neighborhood" as const, placeholder: "Bairro", full: false },
                    { label: "Cidade", field: "city" as const, placeholder: "Cidade", full: false },
                    { label: "Estado", field: "state" as const, placeholder: "SP", full: false },
                  ].map((field) => (
                    <div key={field.label} className={field.full ? "col-span-2" : ""}>
                      <label className="block text-xs font-semibold text-[#7A4B52] mb-2">{field.label}</label>
                      <input
                        placeholder={field.placeholder}
                        value={data[field.field]}
                        onChange={(e) => updateField(field.field, e.target.value)}
                        className="w-full h-12 px-4 border border-[#F2DCDD] rounded-xl text-sm text-[#7A4B52] placeholder-[#6E5A5D] outline-none focus:border-[#D97D93] transition-colors bg-white"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52] mb-6">
                  Opcoes de Entrega
                </h2>

                {loadingShipping ? (
                  <div className="flex items-center gap-2 text-[#6E5A5D]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calculando frete...
                  </div>
                ) : shippingOptions.length > 0 ? (
                  <div className="space-y-3">
                    {shippingOptions.map((option, index) => (
                      <label
                        key={index}
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
                            <p className="text-sm font-semibold text-[#7A4B52]">{option.carrier} - {option.service}</p>
                            <p className="text-xs text-[#6E5A5D] mt-0.5">
                              Prazo estimado: {option.estimatedDays} dias uteis
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-[#7A4B52]">
                          {option.cost === 0 ? (
                            <span className="text-[#3E8B5A]">Gratis</span>
                          ) : (
                            `R$ ${option.cost.toFixed(2)}`
                          )}
                        </p>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#6E5A5D]">
                    <Truck className="h-12 w-12 mx-auto mb-2 text-[#F2DCDD]" />
                    <p>Informe o CEP no endereco para calcular o frete</p>
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52] mb-6">
                  Pagamento
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-6">
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
                  onClick={() => setStep(step - 1)}
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
                onClick={() => (step < 4 ? setStep(step + 1) : handleFinish())}
                disabled={loading}
                className="h-12 px-8 bg-[#D97D93] hover:bg-[#C8667F] text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? "Processando..." : step === 4 ? "Finalizar Pedido" : "Continuar"}{" "}
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
                      ? shippingCost === 0
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
