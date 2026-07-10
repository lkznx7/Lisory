import { api } from "@/lib/api";
import type { AdminProduct } from "@/types/admin";

interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  promotionalPrice: number | null;
  stockQuantity: number;
  categoryId: string | null;
  categoryName: string | null;
  collectionId: string | null;
  collectionName: string | null;
  active: boolean;
  featured: boolean;
  images: { id: string; imageUrl: string; primary: boolean }[];
  createdAt: string;
  updatedAt: string;
}

function mapToAdminProduct(p: ProductResponse): AdminProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description || "",
    category: p.categoryName || "",
    collection: p.collectionName || "",
    price: Number(p.price),
    originalPrice: p.promotionalPrice ? Number(p.price) : null,
    cost: 0,
    images: p.images?.map((i) => i.imageUrl) || [],
    stock: p.stockQuantity,
    sku: p.sku || "",
    weight: 0,
    isActive: p.active,
    isFeatured: p.featured,
    isNew: false,
    isBestseller: false,
    rating: 4.8,
    reviewsCount: 0,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const ProductService = {
  async list(): Promise<AdminProduct[]> {
    const data = await api.get<PaginatedResponse<ProductResponse>>("/api/admin/products?size=100");
    return data.content.map(mapToAdminProduct);
  },

  async getById(id: string): Promise<AdminProduct | undefined> {
    try {
      const p = await api.get<ProductResponse>(`/api/admin/products/${id}`);
      return mapToAdminProduct(p);
    } catch {
      return undefined;
    }
  },

  async create(data: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">): Promise<AdminProduct> {
    const body = {
      name: data.name,
      description: data.description,
      sku: data.sku,
      price: data.price,
      promotionalPrice: data.originalPrice,
      stockQuantity: data.stock,
      active: data.isActive,
      featured: data.isFeatured,
    };
    const p = await api.post<ProductResponse>("/api/admin/products", body);
    return mapToAdminProduct(p);
  },

  async update(id: string, data: Partial<AdminProduct>): Promise<AdminProduct | undefined> {
    const body: Record<string, unknown> = {};
    if (data.name !== undefined) body.name = data.name;
    if (data.description !== undefined) body.description = data.description;
    if (data.sku !== undefined) body.sku = data.sku;
    if (data.price !== undefined) body.price = data.price;
    if (data.originalPrice !== undefined) body.promotionalPrice = data.originalPrice;
    if (data.stock !== undefined) body.stockQuantity = data.stock;
    if (data.isActive !== undefined) body.active = data.isActive;
    if (data.isFeatured !== undefined) body.featured = data.isFeatured;

    try {
      const p = await api.put<ProductResponse>(`/api/admin/products/${id}`, body);
      return mapToAdminProduct(p);
    } catch {
      return undefined;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/admin/products/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  async getLowStock(threshold = 10): Promise<AdminProduct[]> {
    const all = await this.list();
    return all.filter((p) => p.stock > 0 && p.stock <= threshold);
  },

  async getOutOfStock(): Promise<AdminProduct[]> {
    const all = await this.list();
    return all.filter((p) => p.stock === 0);
  },
};
