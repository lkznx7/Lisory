"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { OrderService } from "@/services/order.service";
import { ProductService } from "@/services/product.service";
import { CustomerService } from "@/services/customer.service";
import type {
  DashboardStats,
  SalesDataPoint,
  RecentOrder,
  TopProduct,
  LowStockProduct,
  RecentCustomer,
} from "@/types/admin";

const statusColor: Record<string, string> = {
  delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  pending: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const paymentColor: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  refunded: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
};

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  prefix,
}: {
  title: string;
  value: string;
  change: number;
  icon: typeof DollarSign;
  prefix?: string;
}) {
  const isPositive = change >= 0;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{value}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs">
          {isPositive ? (
            <TrendingUp className="size-3 text-emerald-600" />
          ) : (
            <TrendingDown className="size-3 text-red-600" />
          )}
          <span className={isPositive ? "text-emerald-600" : "text-red-600"}>
            {isPositive ? "+" : ""}{change}%
          </span>
          <span className="text-muted-foreground">vs mês anterior</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    async function load() {
      const [s, sd, ro, ls, rc, allProducts] = await Promise.all([
        OrderService.getDashboardStats(),
        OrderService.getSalesData(),
        OrderService.getRecent(5),
        ProductService.getLowStock(5),
        CustomerService.getRecent(5),
        ProductService.list(),
      ]);
      setStats(s);
      setSalesData(sd);
      setRecentOrders(ro);
      setLowStock(
        ls.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.images[0] || "",
          stock: p.stock,
          category: p.category,
        }))
      );
      setRecentCustomers(rc);
      setTopProducts(
        allProducts
          .filter((p) => p.isBestseller)
          .slice(0, 5)
          .map((p) => ({
            id: p.id,
            name: p.name,
            image: p.images[0] || "",
            totalSold: p.reviewsCount,
            revenue: p.price * p.reviewsCount,
          }))
      );
    }
    load();
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const maxRevenue = Math.max(...salesData.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral da sua loja
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Receita Total"
          value={stats.totalRevenue.toLocaleString("pt-BR")}
          change={stats.revenueChange}
          icon={DollarSign}
          prefix="R$ "
        />
        <StatCard
          title="Pedidos"
          value={String(stats.totalOrders)}
          change={stats.ordersChange}
          icon={ShoppingCart}
        />
        <StatCard
          title="Produtos"
          value={String(stats.totalProducts)}
          change={stats.productsChange}
          icon={Package}
        />
        <StatCard
          title="Clientes"
          value={String(stats.totalCustomers)}
          change={stats.customersChange}
          icon={Users}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {salesData.map((point) => (
                <div
                  key={point.date}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs text-muted-foreground">
                    {point.orders}
                  </span>
                  <div
                    className="w-full rounded-md bg-primary/20 transition-all hover:bg-primary/30"
                    style={{
                      height: `${(point.revenue / maxRevenue) * 100}%`,
                      minHeight: "8px",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {point.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Pedidos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between px-6 py-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.number}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={statusColor[order.status] || ""}
                      variant="secondary"
                    >
                      {order.status}
                    </Badge>
                    <span className="text-sm font-medium">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <AlertTriangle className="size-4 text-amber-500" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {lowStock.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 px-6 py-3"
                >
                  <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      product.stock === 0
                        ? "text-destructive"
                        : "text-amber-600"
                    )}
                  >
                    {product.stock} unid.
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Mais Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {topProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 px-6 py-3"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.totalSold} vendas
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    R$ {product.revenue.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Últimos Clientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center gap-3 px-6 py-3"
                >
                  <Avatar className="size-10">
                    <AvatarImage src={customer.avatar} />
                    <AvatarFallback>
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {customer.email}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    R$ {customer.totalSpent.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

