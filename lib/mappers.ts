import type { Product } from "@/types";

export interface ApiProduct {
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
  images: { id: string; imageUrl: string; isPrimary: boolean }[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  createdAt: string;
}

export function mapApiProductToProduct(api: ApiProduct): Product {
  const primaryImage = api.images?.find((img) => img.isPrimary) || api.images?.[0];
  const hasDiscount = api.promotionalPrice !== null && api.promotionalPrice < api.price;

  return {
    id: api.slug,
    name: api.name,
    price: hasDiscount ? api.promotionalPrice! : api.price,
    originalPrice: hasDiscount ? api.price : undefined,
    image: primaryImage?.imageUrl || "/images/placeholder.jpg",
    category: api.categoryName || "Scoop",
    rating: 4.9,
    reviews: Math.abs(api.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 150) + 50,
    badge: api.featured ? "Mais Popular" : hasDiscount ? "Oferta" : undefined,
    description: api.description,
  };
}

export function mapApiCategoryToCategory(api: ApiCategory): {
  name: string;
  slug: string;
  description: string;
} {
  return {
    name: api.name,
    slug: api.slug,
    description: api.description,
  };
}
