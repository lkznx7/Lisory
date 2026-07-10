import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailContent } from "./content";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRelatedProducts(productId: string) {
  try {
    const res = await fetch(`${API_URL}/products/${productId}/related?limit=4`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};

  return {
    title: product.name,
    description: `${product.name} - ${product.description || "Scoop Lisory"}`,
    openGraph: {
      title: `${product.name} | LISORY`,
      description: product.description || `${product.name} - Scoop Lisory`,
      images: product.images?.[0]?.imageUrl ? [{ url: product.images[0].imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const apiProduct = await getProduct(id);
  if (!apiProduct) notFound();

  const relatedApi = await getRelatedProducts(apiProduct.id);

  const product = {
    id: apiProduct.slug,
    name: apiProduct.name,
    price: apiProduct.promotionalPrice || apiProduct.price,
    originalPrice: apiProduct.promotionalPrice ? apiProduct.price : undefined,
    image: apiProduct.images?.find((img: any) => img.isPrimary)?.imageUrl || apiProduct.images?.[0]?.imageUrl || "/images/placeholder.jpg",
    category: apiProduct.categoryName || "Scoop",
    rating: 4.9,
    reviews: 187,
    description: apiProduct.description,
  };

  const relatedProducts = relatedApi.map((p: any) => ({
    id: p.slug,
    name: p.name,
    price: p.promotionalPrice || p.price,
    originalPrice: p.promotionalPrice ? p.price : undefined,
    image: p.images?.find((img: any) => img.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || "/images/placeholder.jpg",
    category: p.categoryName || "Scoop",
    rating: 4.9,
    reviews: Math.floor(Math.random() * 200) + 50,
  }));

  return <ProductDetailContent product={product as any} relatedProducts={relatedProducts as any} />;
}
