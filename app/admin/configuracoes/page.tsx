"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { AdminSettingsService, type StoreSettings } from "@/services/admin-settings.service";

const defaultSettings: StoreSettings = {
  storeName: "LISORY",
  description: "Joias premium em aço inox 316L. Hipoalergênico, resistente à água, feito para durar uma vida inteira.",
  email: "contato@lisory.com",
  phone: "(11) 99999-8888",
  street: "Rua Oscar Freire",
  number: "900",
  complement: "Sala 305",
  neighborhood: "Jardins",
  city: "São Paulo",
  state: "SP",
  zipCode: "01426-001",
  tiktok: "@lisory.acessorios",
  facebook: "lisory",
  twitter: "",
  seoTitle: "LISORY - Joias Premium em Aço Inoxidável 316L",
  seoDescription: "Joias premium em aço inox 316L. Hipoalergênico, resistente à água, feito para durar uma vida inteira. Frete grátis acima de R$199.",
};

export default function AdminConfiguracoes() {
  const [form, setForm] = useState<StoreSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminSettingsService.getSettings().then((data) => {
      if (data) setForm(data);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    const success = await AdminSettingsService.saveSettings(form);
    setSaving(false);
    if (success) {
      toast.success("Configurações salvas");
    } else {
      toast.error("Erro ao salvar configurações. O endpoint de configurações ainda não está disponível.");
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">Configure os dados da sua loja</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Loja</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome da Loja</Label>
              <Input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Email de Contato</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <textarea
              className="border-input flex min-h-[80px] w-full rounded-md border bg-input-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              maxLength={2000}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Logradouro</Label>
              <Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label>Número</Label>
              <Input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} maxLength={10} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Complemento</Label>
              <Input value={form.complement} onChange={(e) => setForm({ ...form, complement: e.target.value })} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} maxLength={100} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Cidade</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} maxLength={2} />
            </div>
            <div className="space-y-2">
              <Label>CEP</Label>
              <Input value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} maxLength={8} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redes Sociais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>TikTok</Label>
              <Input value={form.tiktok} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Twitter / X</Label>
              <Input value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} maxLength={100} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Título da Página</Label>
            <Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} maxLength={200} />
          </div>
          <div className="space-y-2">
            <Label>Meta Descrição</Label>
            <textarea
              className="border-input flex min-h-[60px] w-full rounded-md border bg-input-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              value={form.seoDescription}
              onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
              maxLength={500}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
}
