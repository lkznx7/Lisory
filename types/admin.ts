export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  collection: string;
  price: number;
  originalPrice: number | null;
  cost: number;
  images: string[];
  stock: number;
  sku: string;
  weight: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string | null;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCollection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: string;
  number: string;
  customer: AdminCustomerSummary;
  items: AdminOrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  shippingCarrier: string | null;
  shippingService: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
}

export interface AdminCustomerSummary {
  id: string;
  name: string;
  email: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus =
  | "pending"
  | "approved"
  | "refunded"
  | "cancelled"
  | "chargeback"
  | "pagamento_na_retirada";

export interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  ordersCount: number;
  totalSpent: number;
  status: "active" | "inactive" | "blocked";
  createdAt: string;
  lastPurchase: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minimumPurchase: number;
  maximumDiscount: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type CouponStatus = "active" | "expired" | "scheduled" | "exhausted" | "inactive";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface RecentOrder {
  id: string;
  number: string;
  customer: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  totalSold: number;
  revenue: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  image: string;
  stock: number;
  category: string;
}

export interface RecentCustomer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalSpent: number;
  date: string;
}
