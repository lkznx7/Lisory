import { api } from "@/lib/api";
import type { AdminOrder, RecentOrder, DashboardStats, SalesDataPoint, AdminCustomerSummary, AdminOrderItem } from "@/types/admin";

interface OrderResponse {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  addressId: string | null;
  addressSummary: string | null;
  couponId: string | null;
  couponCode: string | null;
  status: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  guestCpf: string | null;
  items: { id: string; productId: string; productName: string; productImage: string | null; quantity: number; unitPrice: number; subtotal: number }[];
  paymentId: string | null;
  paymentStatus: string | null;
  paymentMethod: string | null;
  shipmentId: string | null;
  shipmentStatus: string | null;
  trackingCode: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

function mapStatus(backendStatus: string): AdminOrder["status"] {
  const map: Record<string, AdminOrder["status"]> = {
    AGUARDANDO_PAGAMENTO: "pending",
    PAGO: "confirmed",
    PROCESSANDO: "processing",
    ENVIADO: "shipped",
    ENTREGUE: "delivered",
    CANCELADO: "cancelled",
  };
  return map[backendStatus] || "pending";
}

function mapPaymentStatus(backendStatus: string | null): AdminOrder["paymentStatus"] {
  const map: Record<string, AdminOrder["paymentStatus"]> = {
    PENDING: "pending",
    PAID: "approved",
    APPROVED: "approved",
    REFUNDED: "refunded",
    CANCELLED: "cancelled",
  };
  return backendStatus ? map[backendStatus] || "pending" : "pending";
}

function mapToAdminOrder(o: OrderResponse): AdminOrder {
  const addressParts = o.addressSummary?.split(" - ") || [];
  const street = addressParts[0] || "";
  const neighborhood = addressParts[1]?.split(",")[0] || "";
  const cityState = addressParts[1]?.split(", ") || [];
  const city = cityState[1] || "";
  const state = cityState[2] || "";

  return {
    id: o.id,
    number: `#LSR-${o.createdAt.substring(0, 4)}-${o.id.substring(0, 5)}`,
    customer: {
      id: o.userId || "guest",
      name: o.guestName || o.userName || o.guestEmail?.split("@")[0] || "Visitante",
      email: o.guestEmail || o.userEmail || "",
    },
    items: o.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage || "/images/scoop-1.jpg",
      price: Number(item.unitPrice),
      quantity: item.quantity,
      total: Number(item.subtotal),
    })),
    subtotal: Number(o.subtotal),
    shipping: Number(o.shippingCost),
    discount: Number(o.discount),
    total: Number(o.total),
    status: mapStatus(o.status),
    paymentMethod: o.paymentMethod || "PIX",
    paymentStatus: mapPaymentStatus(o.paymentStatus),
    shippingAddress: {
      street,
      number: "",
      complement: "",
      neighborhood,
      city,
      state,
      zipCode: "",
    },
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

export const OrderService = {
  async list(): Promise<AdminOrder[]> {
    const data = await api.get<PaginatedResponse<OrderResponse>>("/api/admin/orders?size=100");
    return data.content.map(mapToAdminOrder);
  },

  async getById(id: string): Promise<AdminOrder | undefined> {
    try {
      const o = await api.get<OrderResponse>(`/api/admin/orders/${id}`);
      return mapToAdminOrder(o);
    } catch {
      return undefined;
    }
  },

  async getRecent(limit = 5): Promise<RecentOrder[]> {
    const orders = await this.list();
    return orders.slice(0, limit).map((o) => ({
      id: o.id,
      number: o.number,
      customer: o.customer.name,
      total: o.total,
      status: o.status,
      paymentStatus: o.paymentStatus,
      date: o.createdAt,
    }));
  },

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const data = await api.get<{ totalRevenue: number; totalOrders: number; paidOrders: number; pendingOrders: number }>("/api/admin/dashboard/stats");
      return {
        totalRevenue: Number(data.totalRevenue),
        totalOrders: Number(data.totalOrders),
        totalProducts: 8,
        totalCustomers: 0,
        revenueChange: 0,
        ordersChange: 0,
        productsChange: 0,
        customersChange: 0,
      };
    } catch {
      return {
        totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0,
        revenueChange: 0, ordersChange: 0, productsChange: 0, customersChange: 0,
      };
    }
  },

  async getSalesData(): Promise<SalesDataPoint[]> {
    return [
      { date: "Jan", revenue: 0, orders: 0 },
      { date: "Fev", revenue: 0, orders: 0 },
      { date: "Mar", revenue: 0, orders: 0 },
      { date: "Abr", revenue: 0, orders: 0 },
      { date: "Mai", revenue: 0, orders: 0 },
      { date: "Jun", revenue: 0, orders: 0 },
    ];
  },

  async updateStatus(id: string, status: AdminOrder["status"]): Promise<AdminOrder | undefined> {
    const statusMap: Record<string, string> = {
      pending: "AGUARDANDO_PAGAMENTO",
      confirmed: "PAGO",
      processing: "PROCESSANDO",
      shipped: "ENVIADO",
      delivered: "ENTREGUE",
      cancelled: "CANCELADO",
    };
    try {
      const o = await api.put<OrderResponse>(`/api/admin/orders/${id}/status`, { status: statusMap[status] || status });
      return mapToAdminOrder(o);
    } catch {
      return undefined;
    }
  },
};
