import { Product, User, Order, Category, Review, Coupon, OrderStatus, ProductFilterParams } from '../types';

const API_BASE = '/api';

// Helper to get active user ID from localStorage if stored
function getUserIdHeader(): Record<string, string> {
  const storedUserId = localStorage.getItem('shopzone_user_id');
  if (storedUserId) {
    return { 'x-user-id': storedUserId };
  }
  return {};
}

export const api = {
  // --- Auth & Users ---
  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getUserIdHeader() },
    });
    const data = await res.json();
    return data.user;
  },

  async login(email: string, name?: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getUserIdHeader() },
      body: JSON.stringify({ email, name }),
    });
    const data = await res.json();
    if (data.user) {
      localStorage.setItem('shopzone_user_id', data.user.id);
    }
    return data.user;
  },

  async updateProfile(profileData: {
    name?: string;
    email?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getUserIdHeader() },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    return data.user;
  },

  async register(userData: {
    name: string;
    email: string;
    role?: 'admin' | 'customer';
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getUserIdHeader() },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (data.user) {
      localStorage.setItem('shopzone_user_id', data.user.id);
    }
    return data.user;
  },

  async switchRole(role: 'admin' | 'customer', userId?: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getUserIdHeader() },
      body: JSON.stringify({ role, userId }),
    });
    const data = await res.json();
    if (data.user) {
      localStorage.setItem('shopzone_user_id', data.user.id);
    }
    return data.user;
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`, {
      headers: { ...getUserIdHeader() },
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    const data = await res.json();
    return data.users;
  },

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    return data.categories;
  },

  // --- Products ---
  async getProducts(params?: ProductFilterParams): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
    if (params?.inStock) query.append('inStock', 'true');
    if (params?.sortBy) query.append('sortBy', params.sortBy);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    const data = await res.json();
    return data.products;
  },

  async getProductDetails(id: string): Promise<{ product: Product; reviews: Review[]; related: Product[] }> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return await res.json();
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getUserIdHeader() },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    const data = await res.json();
    return data.product;
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getUserIdHeader() },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update product');
    }
    const data = await res.json();
    return data.product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { ...getUserIdHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete product');
    const data = await res.json();
    return data.success;
  },

  async addReview(productId: string, rating: number, comment: string): Promise<Review> {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getUserIdHeader() },
      body: JSON.stringify({ rating, comment }),
    });
    if (!res.ok) throw new Error('Failed to submit review');
    const data = await res.json();
    return data.review;
  },

  // --- Coupons ---
  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; message: string; coupon?: Coupon }> {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });
    return await res.json();
  },

  // --- Orders ---
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { ...getUserIdHeader() },
    });
    const data = await res.json();
    return data.orders;
  },

  async getOrder(id: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    if (!res.ok) throw new Error('Order not found');
    const data = await res.json();
    return data.order;
  },

  async checkout(orderPayload: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: any;
    couponCode?: string;
    paymentMethod: string;
    shippingOption?: { name: string; price: number };
  }): Promise<Order> {
    const res = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getUserIdHeader() },
      body: JSON.stringify(orderPayload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Checkout failed');
    }
    const data = await res.json();
    return data.order;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, note?: string, location?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getUserIdHeader() },
      body: JSON.stringify({ status, note, location }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update order status');
    }
    const data = await res.json();
    return data.order;
  },

  // --- Admin Stats ---
  async getAdminStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getUserIdHeader() },
    });
    if (!res.ok) throw new Error('Failed to load admin stats');
    const data = await res.json();
    return data.stats;
  },

  // --- AI ---
  async generateProductCopy(title: string, category: string, keywords?: string) {
    const res = await fetch(`${API_BASE}/ai/generate-product-copy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, keywords }),
    });
    return await res.json();
  },

  async askAiAssistant(query: string): Promise<string> {
    const res = await fetch(`${API_BASE}/ai/ask-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return data.response;
  },
};
