import React, { useState, useEffect } from 'react';
import {
  Package, DollarSign, ShoppingBag, AlertTriangle, Plus, Edit2, Trash2,
  Sparkles, Check, Search, Filter, ShieldCheck, Eye, RefreshCw, X, ArrowRightLeft, Users
} from 'lucide-react';
import { Product, Order, User, OrderStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { InvoiceModal } from './InvoiceModal';

interface AdminDashboardProps {
  onSelectProduct: (product: Product) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectProduct }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'customers'>('products');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Product Create/Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'electronics',
    stock: '15',
    imageUrl: '',
    featured: false,
    tags: 'Featured, Tech',
  });
  const [isGeneratingAiCopy, setIsGeneratingAiCopy] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Invoice Modal for Order Review
  const [viewingInvoiceOrder, setViewingInvoiceOrder] = useState<Order | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [s, p, o, u] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getOrders(),
        api.getUsers(),
      ]);
      setStats(s);
      setProducts(p);
      setOrders(o);
      setUsers(u);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  // AI Product Copywriter Helper
  const handleGenerateAiCopy = async () => {
    if (!productForm.title.trim()) {
      alert('Please enter a product title first so AI knows what to write.');
      return;
    }
    setIsGeneratingAiCopy(true);
    try {
      const res = await api.generateProductCopy(productForm.title, productForm.category, productForm.tags);
      if (res && res.description) {
        setProductForm(prev => ({
          ...prev,
          description: res.description,
          price: prev.price || String(res.suggestedPrice || 99.99),
        }));
        showNotification('AI generated description successfully!');
      }
    } catch (err) {
      console.error('AI copy generation error:', err);
    } finally {
      setIsGeneratingAiCopy(false);
    }
  };

  // Open Create/Edit Product Modal
  const handleOpenCreateProduct = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'electronics',
      stock: '20',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      featured: false,
      tags: 'Gadget, Premium',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      title: prod.title,
      description: prod.description,
      price: String(prod.price),
      originalPrice: prod.originalPrice ? String(prod.originalPrice) : '',
      category: prod.category,
      stock: String(prod.stock),
      imageUrl: prod.images[0] || '',
      featured: Boolean(prod.featured),
      tags: prod.tags?.join(', ') || '',
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) return;

    try {
      const payload: Partial<Product> = {
        title: productForm.title,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        category: productForm.category,
        stock: Number(productForm.stock) || 0,
        images: [productForm.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
        featured: productForm.featured,
        tags: productForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      if (editingProductId) {
        const updated = await api.updateProduct(editingProductId, payload);
        setProducts(prev => prev.map(p => (p.id === editingProductId ? updated : p)));
        showNotification(`Product "${updated.title}" updated.`);
      } else {
        const created = await api.createProduct(payload);
        setProducts(prev => [created, ...prev]);
        showNotification(`Product "${created.title}" published.`);
      }

      setIsProductModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showNotification(`Product removed.`);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      showNotification(`Order ${updated.orderNumber} status updated to ${newStatus}.`);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    orderStatusFilter === 'all' ? true : o.orderStatus === orderStatusFilter
  );

  return (
    <div id="admin-dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Admin Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Console</h1>
            <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
              Full Access
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage product catalog, track customer orders, and view metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
            title="Refresh database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            id="admin-add-product-btn"
            onClick={handleOpenCreateProduct}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Revenue</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            ${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{stats?.totalOrders || 0} total orders</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Orders</span>
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.totalOrders || orders.length}</p>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">
            {stats?.pendingOrders || 0} in progress
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Products</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{products.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Across active catalog</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.lowStockProducts || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">&lt; 10 units remaining</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-100 mb-6 flex gap-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'products' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'customers' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <span className="text-xs text-slate-400">
              {filteredProducts.length} items found
            </span>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3.5 flex items-center gap-3 min-w-[240px]">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 line-clamp-1">{prod.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{prod.id}</p>
                        </div>
                      </td>
                      <td className="p-3.5 uppercase tracking-wider text-[10px] font-semibold text-slate-500">
                        {prod.category}
                      </td>
                      <td className="p-3.5 font-bold text-indigo-600">
                        ${prod.price.toFixed(2)}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          prod.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {prod.stock} left
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">
                        ★ {prod.rating.toFixed(1)} ({prod.reviewCount})
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => onSelectProduct(prod)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.title)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS & FULFILLMENT MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Filter:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 focus:outline-none"
              >
                <option value="all">All ({orders.length})</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <span className="text-xs text-slate-400">
              {filteredOrders.length} orders
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Order #</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Items</th>
                    <th className="p-3.5">Total</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-slate-900 block">{ord.orderNumber}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <p className="font-semibold text-slate-900">{ord.customerName}</p>
                        <p className="text-[10px] text-slate-400">{ord.shippingAddress.city}, {ord.shippingAddress.state}</p>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {ord.items.length} items
                      </td>
                      <td className="p-3.5 font-bold text-indigo-600">
                        ${ord.total.toFixed(2)}
                      </td>
                      <td className="p-3.5">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : ord.orderStatus === 'Out for Delivery'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setViewingInvoiceOrder(ord)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-semibold cursor-pointer"
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover bg-slate-100"
                      />
                      <span className="font-semibold text-slate-900">{u.name}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        u.role === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">{u.email}</td>
                    <td className="p-3.5 text-slate-600">
                      {u.address ? `${u.address.city}, ${u.address.state}` : 'Seattle, WA'}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
              <h3 className="text-sm font-bold text-slate-900">
                {editingProductId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="e.g. Minimalist Noise-Canceling Headphones"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* AI Copywriter Helper Bar */}
              <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-indigo-950">AI Description Generator</span>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAiCopy}
                  disabled={isGeneratingAiCopy || !productForm.title.trim()}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingAiCopy ? 'Generating...' : '✨ Generate'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                  placeholder="Product description and highlights..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    placeholder="199.99"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="249.99"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    required
                    placeholder="25"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="wearables">Wearables & Audio</option>
                    <option value="home-workspace">Home & Workspace</option>
                    <option value="lifestyle">Lifestyle & Apparel</option>
                    <option value="cosmetics">Cosmetics & Beauty</option>
                    <option value="jewelry">Fine Jewelry & Ornaments</option>
                    <option value="costumes">Costumes & Dresses</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={productForm.tags}
                  onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                  placeholder="Wireless, Minimal, Premium"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="featured-check" className="text-xs font-semibold text-slate-700">
                  Feature this product in store highlights
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {editingProductId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal Preview */}
      <InvoiceModal
        order={viewingInvoiceOrder}
        onClose={() => setViewingInvoiceOrder(null)}
      />

    </div>
  );
};
