import { api } from "@/lib/api";
import type { AdminCustomer, RecentCustomer } from "@/types/admin";

interface CustomerResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

function mapToAdminCustomer(c: CustomerResponse): AdminCustomer {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone || "",
    avatar: "",
    ordersCount: Number(c.orderCount) || 0,
    totalSpent: Number(c.totalSpent) || 0,
    status: "active",
    createdAt: c.createdAt || "",
    lastPurchase: "",
  };
}

export const CustomerService = {
  async list(): Promise<AdminCustomer[]> {
    try {
      const data = await api.get<PaginatedResponse<CustomerResponse>>("/api/admin/customers?size=100");
      return data.content.map(mapToAdminCustomer);
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<AdminCustomer | undefined> {
    try {
      const c = await api.get<CustomerResponse>(`/api/admin/customers/${id}`);
      return mapToAdminCustomer(c);
    } catch {
      return undefined;
    }
  },

  async getRecent(limit = 5): Promise<RecentCustomer[]> {
    const customers = await this.list();
    return customers.slice(0, limit).map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      avatar: c.avatar,
      totalSpent: c.totalSpent,
      date: c.createdAt,
    }));
  },

  async getTopCustomers(limit = 5): Promise<AdminCustomer[]> {
    const customers = await this.list();
    return [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, limit);
  },
};
