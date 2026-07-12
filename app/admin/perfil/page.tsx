"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AdminSettingsService } from "@/services/admin-settings.service";

export default function AdminPerfil() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminSettingsService.getProfile().then((data) => {
      if (data) {
        setProfile(data);
      } else if (user) {
        setProfile({ name: user.email.split("@")[0], email: user.email, phone: "" });
      }
      setLoading(false);
    });
  }, [user]);

  async function handleSaveProfile() {
    setSaving(true);
    const success = await AdminSettingsService.saveProfile(profile);
    setSaving(false);
    if (success) {
      toast.success("Perfil atualizado");
    } else {
      toast.error("Erro ao salvar perfil. O endpoint de perfil ainda não está disponível.");
    }
  }

  async function handleChangePassword() {
    if (passwords.new !== passwords.confirm) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (passwords.new.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    setSaving(true);
    const success = await AdminSettingsService.changePassword(passwords.current, passwords.new);
    setSaving(false);
    if (success) {
      setPasswords({ current: "", new: "", confirm: "" });
      toast.success("Senha alterada com sucesso");
    } else {
      toast.error("Erro ao alterar senha. O endpoint de senha ainda não está disponível.");
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
        <h1 className="text-2xl font-semibold tracking-tight">Perfil</h1>
        <p className="text-sm text-muted-foreground">Gerencie seus dados de administrador</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Administrador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src="/images/admin-avatar.jpg" />
              <AvatarFallback className="text-lg">AD</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Alterar Foto
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} maxLength={20} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Salvando..." : "Salvar Perfil"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Senha Atual</Label>
            <Input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} maxLength={128} />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nova Senha</Label>
              <Input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} maxLength={128} />
            </div>
            <div className="space-y-2">
              <Label>Confirmar Nova Senha</Label>
              <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} maxLength={128} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleChangePassword} disabled={saving}>
              {saving ? "Alterando..." : "Alterar Senha"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
