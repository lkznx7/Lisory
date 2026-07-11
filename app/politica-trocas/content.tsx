"use client";

import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function ExchangePolicyContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-serif text-foreground mb-4">Politica de Trocas</h1>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          Sua satisfacao e nossa prioridade. Conheca nossas garantias e politicas de troca.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Garantia
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-foreground/10">
              <h3 className="text-lg font-medium text-foreground mb-2">Pecas Douradas</h3>
              <p className="text-4xl font-serif text-primary mb-2">6 meses</p>
              <p className="text-sm text-foreground/60">
                Garantia contra defeitos de fabricacao em pecas banidas a ouro
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-foreground/10">
              <h3 className="text-lg font-medium text-foreground mb-2">Pecas Prata</h3>
              <p className="text-4xl font-serif text-primary mb-2">1 ano</p>
              <p className="text-sm text-foreground/60">
                Garantia completa contra defeitos de fabricacao em pecas de prata
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            O que esta coberto
          </h2>
          <div className="bg-white rounded-xl p-6 border border-foreground/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <span>Defeito de fabricacao</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <span>Pecas faltando na embalagem</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <span>Problemas em fechos e fechaduras</span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-500" />
            O que NAO esta coberto
          </h2>
          <div className="bg-white rounded-xl p-6 border border-foreground/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span>Mau uso do produto</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span>Quedas ou impactos</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span>Alteracoes feitas pelo cliente</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span>Danos por armazenamento incorreto</span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Como solicitar uma troca
          </h2>
          <div className="bg-white rounded-xl p-6 border border-foreground/10">
            <ol className="space-y-3 list-decimal list-inside">
              <li>Entre em contato pelo email</li>
              <li>Informe o numero do seu pedido</li>
              <li>Descreva o problema encontrado</li>
              <li>Anexe fotos do defeito, quando possivel</li>
              <li>Aguarde orientacoes da nossa equipe</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
