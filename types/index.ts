export type Page =
  | "home"
  | "category"
  | "product"
  | "cart"
  | "checkout"
  | "confirmation"
  | "account"
  | "wishlist"
  | "about"
  | "contact"
  | "faq";

export interface ScoopDetails {
  items: number;
  extra: boolean;
  exchanges: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestseller?: boolean;
  description?: string;
  scoop?: ScoopDetails;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface Category {
  name: string;
  image: string;
  count: number;
}

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
  location: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  items: number;
  total: number;
}

export interface Review {
  name: string;
  rating: number;
  date: string;
  text: string;
}

export interface ShippingOption {
  carrier: string;
  service: string;
  cost: number;
  estimatedDays: number;
  carrierCode?: string;
  serviceCode?: string;
}

export interface FreightCalculationRequest {
  zipCode: string;
  items: {
    productId: string;
    quantity: number;
    weight: number;
    width: number;
    height: number;
    length: number;
  }[];
}

export interface FreightCalculationResponse {
  options: ShippingOption[];
}

export interface OrderConfirmation {
  orderId: string;
  status: string;
  paymentLink?: string;
  paymentMethod: string;
  total: number;
}

export interface ProductDimensions {
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
}
