import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailContent } from "./content";
import { products as fallbackProducts, getProductById } from "@/constants/data";
import type { Product } from "@/types";
import { formatProductPrice } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.lisory.com.br";

interface ApiImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

interface ApiProductResponse {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  promotionalPrice: number | null;
  categoryName: string | null;
  images: ApiImage[];
  rating?: number;
  reviews?: number;
}

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(slug: string): Promise<Product | ApiProductResponse | null> {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return getProductById(slug) || null;
    }
    return res.json();
  } catch {
    return getProductById(slug) || null;
  }
}

async function getRelatedProducts(productId: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products/${productId}/related?limit=4`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data: ApiProductResponse[] = await res.json();
    return data.map((p) => ({
      id: p.slug || p.id,
      name: p.name,
      price: formatProductPrice(p.promotionalPrice || p.price),
      originalPrice: p.promotionalPrice ? formatProductPrice(p.price) : undefined,
      image: p.images?.find((img) => img.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || "/images/scoop-1.jpg",
      category: p.categoryName || "Scoop",
      rating: p.rating || 4.9,
      reviews: p.reviews || 150,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};

  const name = "name" in product ? product.name : "";
  const description = "description" in product ? product.description : "";

  return {
    title: name,
    description: `${name} - ${description || "Scoop Lisory"}`,
    openGraph: {
      title: `${name} | LISORY`,
      description: description || `${name} - Scoop Lisory`,
      images: "images" in product && product.images?.[0]?.imageUrl ? [{ url: product.images[0].imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  let apiProduct = await getProduct(id);

  // Safely check if the product has a valid price, name and structure. 
  // If the API returned an error payload or empty object, fall back to constants.
  const hasValidPrice = 
    apiProduct && 
    typeof apiProduct === "object" && 
    "price" in apiProduct && 
    (apiProduct as any).price !== null &&
    (apiProduct as any).price !== undefined;

  if (!hasValidPrice) {
    apiProduct = getProductById(id) || null;
  }

  if (!apiProduct) notFound();

  const isApiProduct = 
    apiProduct &&
    typeof apiProduct === "object" &&
    "images" in apiProduct && 
    Array.isArray((apiProduct as any).images);

  const product: Product = isApiProduct
    ? {
        id: (apiProduct as any).slug || (apiProduct as any).id,
        name: (apiProduct as any).name,
        price: formatProductPrice(Number((apiProduct as any).promotionalPrice || (apiProduct as any).price)),
        originalPrice: (apiProduct as any).promotionalPrice ? formatProductPrice(Number((apiProduct as any).price)) : undefined,
        image: (apiProduct as any).images?.find((img: any) => img.isPrimary)?.imageUrl || (apiProduct as any).images?.[0]?.imageUrl || "/images/scoop-1.jpg",
        category: (apiProduct as any).categoryName || "Scoop",
        rating: (apiProduct as any).rating || 4.9,
        reviews: (apiProduct as any).reviews || 187,
        description: (apiProduct as any).description,
      }
    : (apiProduct as Product);

  const relatedApi = await getRelatedProducts(isApiProduct ? (apiProduct as any).id : product.id);

  const relatedProducts = relatedApi.length > 0
    ? relatedApi
    : fallbackProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return <ProductDetailContent product={product} relatedProducts={relatedProducts} />;
}
