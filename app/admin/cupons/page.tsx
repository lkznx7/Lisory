"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Copy, Power, PowerOff, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CouponService } from "@/services/coupon.service";
import type { AdminCoupon, CouponStatus } from "@/types/admin";

const couponStatusConfig: Record<CouponStatus, { label: string; color: string }> = {
  active: { label: "Ativo", color: "bg-emerald-100 text-emerald-700" },
  expired: { label: "Expirado", color: "bg-red-100 text-red-700" },
  scheduled: { label: "Agendado", color: "bg-blue-100 text-blue-700" },
  exhausted: { label: "Esgotado", color: "bg-amber-100 text-amber-700" },
  inactive: { label: "Inativo", color: "bg-gray-100 text-gray-700" },
};

const typeLabel: Record<string, string> = {
  percentage: "Percentual",
  fixed: "Fixo",
  free_shipping: "Frete Grátis",
};

export default function AdminCupons() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [form, setForm] = useState({
    code: "",
    type: "percentage" as AdminCoupon["type"],
    value: 0,
    minimumPurchase: 0,
    maximumDiscount: 0,
    usageLimit: 0,
    startDate: "",
    endDate: "",
    isActive: true,
    description: "",
  });

  useEffect(() => {
    async function load() {
      const data = await CouponService.list();
      setCoupons(data);
      const filters: Record<string, boolean> = {};
      for (const c of data) {
        const status = await CouponService.getStatus(c);
        filters[status] = true;
      }
      setStatusFilters(filters);
      setLoading(false);
    }
    load();
  }, []);

  const activeStatuses = Object.entries(statusFilters)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const filtered = coupons.filter((c) => {
    // we compute status in the filter
    return true; // we'll compute below
  });

  // We need status for each coupon, so compute in render
  const [couponStatuses, setCouponStatuses] = useState<Record<string, CouponStatus>>({});

  useEffect(() => {
    async function computeStatuses() {
      const map: Record<string, CouponStatus> = {};
      for (const c of coupons) {
        map[c.id] = await CouponService.getStatus(c);
      }
      setCouponStatuses(map);
    }
    if (coupons.length > 0) computeStatuses();
  }, [coupons]);

  const displayed = coupons.filter((c) => {
    const s = couponStatuses[c.id];
    return activeStatuses.includes(s);
  });

  function resetForm() {
    setForm({
      code: "",
      type: "percentage",
      value: 0,
      minimumPurchase: 0,
      maximumDiscount: 0,
      usageLimit: 0,
      startDate: "",
      endDate: "",
      isActive: true,
      description: "",
    });
    setEditing(null);
  }

  function openEdit(c: AdminCoupon) {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      minimumPurchase: c.minimumPurchase,
      maximumDiscount: c.maximumDiscount,
      usageLimit: c.usageLimit,
      startDate: c.startDate,
      endDate: c.endDate,
      isActive: c.isActive,
      description: c.description,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    const payload = { ...form };
    if (editing) {
      const updated = await CouponService.update(editing.id, payload);
      if (updated) {
        setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        toast.success("Cupom atualizado");
      }
    } else {
      const created = await CouponService.create({ ...payload, usedCount: 0 });
      setCoupons((prev) => [...prev, created]);
      toast.success("Cupom criado");
    }
    setDialogOpen(false);
    resetForm();
  }

  async function handleDelete(id: string) {
    await CouponService.delete(id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success("Cupom removido");
  }

  async function handleToggle(id: string) {
    const updated = await CouponService.toggleActive(id);
    if (updated) {
      setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      toast.success(updated.isActive ? "Cupom ativado" : "Cupom desativado");
    }
  }

  async function handleDuplicate(id: string) {
    const duplicated = await CouponService.duplicate(id);
    if (duplicated) {
      setCoupons((prev) => [...prev, duplicated]);
      toast.success("Cupom duplicado");
    }
  }

  function toggleStatusFilter(status: string) {
    setStatusFilters((prev) => ({ ...prev, [status]: !prev[status] }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cupons</h1>
          <p className="text-sm text-muted-foreground">Gerencie os cupons de desconto</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" /> Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Cupom" : "Novo Cupom"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={form.type} onValueChange={(v: AdminCoupon["type"]) => setForm({ ...form, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentual</SelectItem>
                      <SelectItem value="fixed">Fixo (R$)</SelectItem>
                      <SelectItem value="free_shipping">Frete Grátis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{form.type === "percentage" ? "Valor (%)" : form.type === "fixed" ? "Valor (R$)" : "Valor Mínimo (R$)"}</Label>
                  <Input type="number" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Compra Mínima (R$)</Label>
                  <Input type="number" step="0.01" value={form.minimumPurchase} onChange={(e) => setForm({ ...form, minimumPurchase: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Desconto Máximo (R$)</Label>
                  <Input type="number" step="0.01" value={form.maximumDiscount} onChange={(e) => setForm({ ...form, maximumDiscount: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Limite de Usos</Label>
                  <Input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <textarea
                  className="border-input flex min-h-[60px] w-full rounded-md border bg-input-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                Ativo
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancelar</Button>
                <Button onClick={handleSave}>Salvar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(couponStatusConfig) as CouponStatus[]).map((status) => (
          <Button
            key={status}
            variant={statusFilters[status] ? "default" : "outline"}
            size="sm"
            onClick={() => toggleStatusFilter(status)}
          >
            {couponStatusConfig[status].label}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  <TicketPercent className="mx-auto mb-2 size-8 opacity-50" />
                  Nenhum cupom encontrado
                </TableCell>
              </TableRow>
            ) : (
              displayed.map((coupon) => {
                const status = couponStatuses[coupon.id];
                const cfg = couponStatusConfig[status] || couponStatusConfig.inactive;
                return (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-0.5 text-sm font-semibold tracking-wider">
                        {coupon.code}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {typeLabel[coupon.type]}
                    </TableCell>
                    <TableCell className="font-medium">
                      {coupon.type === "percentage"
                        ? `${coupon.value}%`
                        : coupon.type === "fixed"
                        ? `R$ ${coupon.value.toFixed(2)}`
                        : "Frete Grátis"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {coupon.usedCount}/{coupon.usageLimit}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(coupon.startDate).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(coupon.endDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge className={cfg.color} variant="secondary">
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleToggle(coupon.id)} title={coupon.isActive ? "Desativar" : "Ativar"}>
                          {coupon.isActive ? <PowerOff className="size-4" /> : <Power className="size-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDuplicate(coupon.id)} title="Duplicar">
                          <Copy className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(coupon)}>
                          <Pencil className="size-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir cupom</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o cupom {coupon.code}? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(coupon.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
