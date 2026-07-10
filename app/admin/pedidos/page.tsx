"use client";

import { useEffect, useState } from "react";
import { Search, ShoppingCart, Eye } from "lucide-react";
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
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { OrderService } from "@/services/order.service";
import type { AdminOrder, OrderStatus } from "@/types/admin";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendente", color: "bg-gray-100 text-gray-700" },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-700" },
  processing: { label: "Processando", color: "bg-amber-100 text-amber-700" },
  shipped: { label: "Enviado", color: "bg-indigo-100 text-indigo-700" },
  delivered: { label: "Entregue", color: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-700" },
  returned: { label: "Devolvido", color: "bg-rose-100 text-rose-700" },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendente", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Aprovado", color: "bg-emerald-100 text-emerald-700" },
  refunded: { label: "Reembolsado", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelado", color: "bg-gray-100 text-gray-700" },
  chargeback: { label: "Chargeback", color: "bg-rose-100 text-rose-700" },
};

const statusTimeline: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export default function AdminPedidos() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  useEffect(() => {
    async function load() {
      const data = await OrderService.list();
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  async function handleStatusUpdate(orderId: string, status: OrderStatus) {
    const updated = await OrderService.updateStatus(orderId, status);
    if (updated) {
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      if (selectedOrder?.id === orderId) setSelectedOrder(updated);
      toast.success("Status do pedido atualizado");
    }
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pedidos</h1>
        <p className="text-sm text-muted-foreground">Acompanhe e gerencie os pedidos</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nº ou cliente..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <SelectItem key={key} value={key}>
                {cfg.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="w-16 text-right">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  <ShoppingCart className="mx-auto mb-2 size-8 opacity-50" />
                  Nenhum pedido encontrado
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.number}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell className="font-medium">
                    R$ {order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[order.status]?.color} variant="secondary">
                      {statusConfig[order.status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={paymentStatusConfig[order.paymentStatus]?.color} variant="secondary">
                      {paymentStatusConfig[order.paymentStatus]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
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
        open={!!selectedOrder}
        onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}
      >
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Pedido {selectedOrder?.number}</DrawerTitle>
            <DrawerDescription>
              Detalhes completos do pedido
            </DrawerDescription>
          </DrawerHeader>
          {selectedOrder && (
            <div className="space-y-6 overflow-y-auto px-6 pb-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Cliente
                  </h4>
                  <div className="space-y-1">
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Pagamento
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      {selectedOrder.paymentMethod} —{" "}
                      <Badge className={paymentStatusConfig[selectedOrder.paymentStatus]?.color} variant="secondary">
                        {paymentStatusConfig[selectedOrder.paymentStatus]?.label}
                      </Badge>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Subtotal: R$ {selectedOrder.subtotal.toFixed(2)} | Frete: R$ {selectedOrder.shipping.toFixed(2)}
                      {selectedOrder.discount > 0 && ` | Desconto: -R$ ${selectedOrder.discount.toFixed(2)}`}
                    </p>
                    <p className="text-base font-semibold">
                      Total: R$ {selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Endereço de Entrega
                </h4>
                <p className="text-sm">
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.number}
                  {selectedOrder.shippingAddress.complement && ` - ${selectedOrder.shippingAddress.complement}`}
                  <br />
                  {selectedOrder.shippingAddress.neighborhood}, {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.state}
                  <br />
                  CEP: {selectedOrder.shippingAddress.zipCode}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Itens
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                      <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        <img src={item.productImage} alt={item.productName} className="size-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          Qtd: {item.quantity} x R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">R$ {item.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Atualizar Status
                </h4>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(v: OrderStatus) => handleStatusUpdate(selectedOrder.id, v)}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusTimeline.map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusConfig[s]?.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="returned">Devolvido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Timeline
                </h4>
                <div className="space-y-0">
                  {statusTimeline.map((s, i) => {
                    const currentIndex = statusTimeline.indexOf(selectedOrder.status as OrderStatus);
                    const isPast = i <= currentIndex;
                    const isCurrent = i === currentIndex;
                    return (
                      <div key={s} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`size-3 rounded-full border-2 ${
                              isPast
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/30 bg-background"
                            } ${isCurrent ? "ring-2 ring-primary/30" : ""}`}
                          />
                          {i < statusTimeline.length - 1 && (
                            <div
                              className={`w-0.5 flex-1 ${
                                isPast && i < currentIndex
                                  ? "bg-primary"
                                  : "bg-muted-foreground/20"
                              }`}
                            />
                          )}
                        </div>
                        <div className={`pb-6 ${isCurrent ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                          <p className="text-sm">{statusConfig[s]?.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
