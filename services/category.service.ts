import { api } from "@/lib/api";
import type { AdminCategory } from "@/types/admin";

interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
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

function mapToAdminCategory(c: CategoryResponse): AdminCategory {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    image: "",
    parentId: null,
    productCount: 0,
    isActive: c.active,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export const CategoryService = {
  async list(): Promise<AdminCategory[]> {
    const data = await api.get<CategoryResponse[]>("/categories");
    if (Array.isArray(data)) return data.map(mapToAdminCategory);
    return [];
  },

  async getById(id: string): Promise<AdminCategory | undefined> {
    try {
      const categories = await this.list();
      return categories.find((c) => c.id === id);
    } catch {
      return undefined;
    }
  },

  async create(data: Omit<AdminCategory, "id" | "createdAt" | "updatedAt">): Promise<AdminCategory> {
    const body = {
      name: data.name,
      description: data.description,
      active: data.isActive,
    };
    const c = await api.post<CategoryResponse>("/api/admin/categories", body);
    return mapToAdminCategory(c);
  },

  async update(id: string, data: Partial<AdminCategory>): Promise<AdminCategory | undefined> {
    const body: Record<string, unknown> = {};
    if (data.name !== undefined) body.name = data.name;
    if (data.description !== undefined) body.description = data.description;
    if (data.isActive !== undefined) body.active = data.isActive;

    try {
      const c = await api.put<CategoryResponse>(`/api/admin/categories/${id}`, body);
      return mapToAdminCategory(c);
    } catch {
      return undefined;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/admin/categories/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  async listCollections(): Promise<AdminCategory[]> {
    try {
      const data = await api.get<CategoryResponse[]>("/collections");
      if (Array.isArray(data)) return data.map(mapToAdminCategory);
      return [];
    } catch {
      return [];
    }
  },
};
