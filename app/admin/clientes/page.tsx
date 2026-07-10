"use client";

import { useEffect, useState } from "react";
import { Search, Users, Eye, Mail, Phone, ShoppingBag, DollarSign } from "lucide-react";
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
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CustomerService } from "@/services/customer.service";
import type { AdminCustomer } from "@/types/admin";

const statusBadge: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-gray-100 text-gray-700",
  blocked: "bg-red-100 text-red-700",
};

export default function AdminClientes() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminCustomer | null>(null);

  useEffect(() => {
    async function load() {
      const data = await CustomerService.list();
      setCustomers(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
        <p className="text-sm text-muted-foreground">Gerencie seus clientes</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou email..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Total Gasto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cliente Desde</TableHead>
              <TableHead className="w-16 text-right">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  <Users className="mx-auto mb-2 size-8 opacity-50" />
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={customer.avatar} />
                        <AvatarFallback>
                          {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{customer.ordersCount}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    R$ {customer.totalSpent.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusBadge[customer.status]} variant="secondary">
                      {customer.status === "active" ? "Ativo" : customer.status === "inactive" ? "Inativo" : "Bloqueado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(customer.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelected(customer)}>
                      <Eye className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Drawer
        open={!!selected}
        onOpenChange={(open) => { if (!open) setSelected(null); }}
      >
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Detalhes do Cliente</DrawerTitle>
            <DrawerDescription>Informações completas do cliente</DrawerDescription>
          </DrawerHeader>
          {selected && (
            <div className="space-y-6 overflow-y-auto px-6 pb-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarImage src={selected.avatar} />
                  <AvatarFallback className="text-lg">
                    {selected.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selected.name}</h3>
                  <Badge className={statusBadge[selected.status]} variant="secondary">
                    {selected.status === "active" ? "Ativo" : selected.status === "inactive" ? "Inativo" : "Bloqueado"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  {selected.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  {selected.phone}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShoppingBag className="size-4 text-muted-foreground" />
                  {selected.ordersCount} pedidos realizados
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="size-4 text-muted-foreground" />
                  R$ {selected.totalSpent.toFixed(2)} em compras
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Cliente desde
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(selected.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Última compra
                  </p>
                  <p className="text-sm font-medium">
                    {selected.lastPurchase
                      ? new Date(selected.lastPurchase).toLocaleDateString("pt-BR")
                      : "Nenhuma compra"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
