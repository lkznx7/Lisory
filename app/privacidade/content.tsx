"use client";

export default function PrivacyContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif text-foreground mb-8 text-center">Politica de Privacidade</h1>
      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-serif text-foreground mb-4">1. Dados Coletados</h2>
          <p className="text-foreground/70 leading-relaxed">
            Para processar seu pedido, coletamos: nome, email, telefone, endereco de entrega e dados de pagamento.
            Para compras como visitante, armazenamos apenas os dados fornecidos no checkout.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-foreground mb-4">2. Uso dos Dados</h2>
          <p className="text-foreground/70 leading-relaxed">
            Seus dados sao utilizados exclusivamente para: processar pedidos, enviar comunicacoes sobre
            seu pedido, melhorar nossos servicos e, quando autorizado, enviar informacoes promocionais.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-foreground mb-4">3. Compartilhamento</h2>
          <p className="text-foreground/70 leading-relaxed">
            Compartilhamos dados apenas com: transportadoras (para entrega), gateways de pagamento
            (para processamento) e autoridades quando exigido por lei.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-foreground mb-4">4. Seguranca</h2>
          <p className="text-foreground/70 leading-relaxed">
            Utilizamos criptografia SSL e seguimos padroes de seguranca para proteger seus dados.
            Dados de pagamento nao sao armazenados em nossos servidores.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-foreground mb-4">5. Seus Direitos</h2>
          <p className="text-foreground/70 leading-relaxed">
            Voce tem direito a: acessar seus dados, correcao de dados incorretos, exclusao de dados
            e revogacao de consentimento para comunicacoes de marketing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-foreground mb-4">6. Cookies</h2>
          <p className="text-foreground/70 leading-relaxed">
            Utilizamos cookies para melhorar sua experiencia de navegacao. Voce pode configurar seu
            navegador para recusar cookies, mas isso pode afetar a funcionalidade do site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-foreground mb-4">7. Contato</h2>
          <p className="text-foreground/70 leading-relaxed">
            Questoes sobre privacidade? Entre em contato: oi@lisory.com.br
          </p>
        </section>
      </div>
    </div>
  );
}
