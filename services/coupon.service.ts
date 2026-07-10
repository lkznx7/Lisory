import { api } from "@/lib/api";
import type { AdminCoupon, CouponStatus } from "@/types/admin";

interface CouponResponse {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  maxUsesPerCustomer: number;
  expiresAt: string | null;
  active: boolean;
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

function mapToAdminCoupon(c: CouponResponse): AdminCoupon {
  const typeMap: Record<string, AdminCoupon["type"]> = {
    PERCENTAGE: "percentage",
    FIXED: "fixed",
  };
  return {
    id: c.id,
    code: c.code,
    type: typeMap[c.discountType] || "percentage",
    value: Number(c.discountValue),
    minimumPurchase: Number(c.minOrderValue || 0),
    maximumDiscount: 0,
    usageLimit: c.maxUses || 0,
    usedCount: c.usedCount || 0,
    startDate: c.createdAt,
    endDate: c.expiresAt || "",
    isActive: c.active,
    description: `${c.discountType === "PERCENTAGE" ? c.discountValue + "% OFF" : "R$" + c.discountValue + " de desconto"}`,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export const CouponService = {
  async list(): Promise<AdminCoupon[]> {
    const data = await api.get<PaginatedResponse<CouponResponse>>("/api/admin/coupons?size=100");
    return data.content.map(mapToAdminCoupon);
  },

  async getById(id: string): Promise<AdminCoupon | undefined> {
    try {
      const c = await api.get<CouponResponse>(`/api/admin/coupons/${id}`);
      return mapToAdminCoupon(c);
    } catch {
      return undefined;
    }
  },

  async create(data: Omit<AdminCoupon, "id" | "createdAt" | "updatedAt">): Promise<AdminCoupon> {
    const typeMap: Record<string, string> = { percentage: "PERCENTAGE", fixed: "FIXED", free_shipping: "PERCENTAGE" };
    const body = {
      code: data.code,
      discountType: typeMap[data.type] || "PERCENTAGE",
      discountValue: data.value,
      minOrderValue: data.minimumPurchase,
      maxUses: data.usageLimit,
      maxUsesPerCustomer: 1,
      expiresAt: data.endDate ? new Date(data.endDate).toISOString() : new Date(Date.now() + 365 * 86400000).toISOString(),
      active: data.isActive,
    };
    const c = await api.post<CouponResponse>("/api/admin/coupons", body);
    return mapToAdminCoupon(c);
  },

  async update(id: string, data: Partial<AdminCoupon>): Promise<AdminCoupon | undefined> {
    const typeMap: Record<string, string> = { percentage: "PERCENTAGE", fixed: "FIXED", free_shipping: "PERCENTAGE" };
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const body = {
      code: data.code ?? existing.code,
      discountType: typeMap[data.type ?? existing.type] || "PERCENTAGE",
      discountValue: data.value ?? existing.value,
      minOrderValue: data.minimumPurchase ?? existing.minimumPurchase,
      maxUses: data.usageLimit ?? existing.usageLimit,
      maxUsesPerCustomer: 1,
      expiresAt: (data.endDate ?? existing.endDate) ? new Date(data.endDate ?? existing.endDate).toISOString() : new Date(Date.now() + 365 * 86400000).toISOString(),
      active: data.isActive ?? existing.isActive,
    };

    try {
      const c = await api.put<CouponResponse>(`/api/admin/coupons/${id}`, body);
      return mapToAdminCoupon(c);
    } catch {
      return undefined;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/admin/coupons/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  async getStatus(coupon: AdminCoupon): Promise<CouponStatus> {
    try {
      const data = await api.get<{ code: string; status: string; description: string }>(`/api/admin/coupons/${coupon.id}/status`);
      return data.status as CouponStatus;
    } catch {
      return "inactive";
    }
  },

  async toggleActive(id: string): Promise<AdminCoupon | undefined> {
    try {
      const c = await api.post<CouponResponse>(`/api/admin/coupons/${id}/toggle`);
      return mapToAdminCoupon(c);
    } catch {
      return undefined;
    }
  },

  async duplicate(id: string): Promise<AdminCoupon | undefined> {
    try {
      const c = await api.post<CouponResponse>(`/api/admin/coupons/${id}/duplicate`);
      return mapToAdminCoupon(c);
    } catch {
      return undefined;
    }
  },
};
