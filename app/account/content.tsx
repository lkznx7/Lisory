"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  User,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/product/badge";

const sidebarItems = [
  { id: "pedidos", label: "Meus Pedidos", icon: Package },
  { id: "favoritos", label: "Lista de Desejos", icon: Heart },
  { id: "enderecos", label: "Endereços", icon: MapPin },
  { id: "cartoes", label: "Cartões", icon: CreditCard },
  { id: "dados", label: "Dados Pessoais", icon: User },
];

const orders = [
  { id: "#LSR-2026-08421", date: "15 jun 2026", status: "Entregue", items: 2, total: 338 },
  { id: "#LSR-2026-07103", date: "02 mai 2026", status: "Em trânsito", items: 1, total: 189 },
  { id: "#LSR-2026-05842", date: "18 mar 2026", status: "Entregue", items: 3, total: 527 },
];

export function AccountPageContent() {
  const [activeSection, setActiveSection] = useState("pedidos");

  const ActiveIcon = sidebarItems.find((s) => s.id === activeSection)?.icon || User;

  return (
    <main className="pt-[88px] lg:pt-[96px] min-h-screen bg-[#FFF9F8]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="space-y-2">
            <div className="bg-white border border-[#F2DCDD] rounded-[18px] p-5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FCEEEF] rounded-full flex items-center justify-center text-lg font-semibold text-[#7A4B52]">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#7A4B52]">Ana Silva</p>
                  <p className="text-xs text-[#6E5A5D]">ana@email.com</p>
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
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#D64F4F] hover:bg-red-50 transition-colors mt-4">
              <LogOut size={16} /> Sair
            </button>
          </aside>

          <div className="lg:col-span-3">
            {activeSection === "pedidos" && (
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#7A4B52] mb-6">
                  Meus Pedidos
                </h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-[#F2DCDD] rounded-[18px] p-5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-semibold text-[#7A4B52]">
                            {order.id}
                          </p>
                          <p className="text-xs text-[#6E5A5D]">
                            {order.date} · {order.items} item(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              order.status === "Entregue"
                                ? "champagne"
                                : "rose"
                            }
                          >
                            {order.status}
                          </Badge>
                          <span className="text-sm font-semibold text-[#7A4B52]">
                            R${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-3 border-t border-[#F2DCDD]">
                        <button className="text-xs text-[#D97D93] hover:underline">
                          Ver detalhes
                        </button>
                        <span className="text-[#F2DCDD]">·</span>
                        <button className="text-xs text-[#6E5A5D] hover:text-[#D97D93] transition-colors">
                          Rastrear
                        </button>
                        {order.status === "Entregue" && (
                          <>
                            <span className="text-[#F2DCDD]">·</span>
                            <button className="text-xs text-[#6E5A5D] hover:text-[#D97D93] transition-colors">
                              Solicitar troca
                            </button>
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
                <div className="w-16 h-16 bg-[#FCEEEF] rounded-full flex items-center justify-center">
                  <ActiveIcon size={24} className="text-[#D97D93]" />
                </div>
                <h2 className="font-['Cormorant_Garamond'] text-2xl font-light text-[#7A4B52]">
                  {sidebarItems.find((s) => s.id === activeSection)?.label}
                </h2>
                <p className="text-sm text-[#6E5A5D]">Seção em breve disponível</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
