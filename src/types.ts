export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  featured?: boolean;
  isNew?: boolean;
  tags?: string[];
  specs?: ProductSpec[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

export interface OrderStatusCheckpoint {
  status: OrderStatus;
  timestamp: string;
  note: string;
  location?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusCheckpoint[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minSpend: number;
  description: string;
}

export interface OrderFilterParams {
  status?: string;
  search?: string;
  userId?: string;
}

export interface ProductFilterParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
