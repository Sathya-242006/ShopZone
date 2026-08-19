/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  Grid,
  List,
  Tag,
  ShieldCheck,
  Heart,
  Package,
  ShoppingBag,
  ArrowRight,
  X,
} from 'lucide-react';
import { Product, Category, Order } from './types';
import { api } from './services/api';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { LocaleProvider, useLocale } from './context/LocaleContext';

import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AdminDashboard } from './components/AdminDashboard';
import { AiShoppingAssistant } from './components/AiShoppingAssistant';
import { AuthModal } from './components/AuthModal';

function StoreApp() {
  const { role } = useAuth();
  const { isCheckoutOpen, setIsCheckoutOpen } = useCart();
  const { wishlist } = useWishlist();
  const { formatPrice, t, country } = useLocale();

  // Navigation View: 'catalog' | 'tracking' | 'admin' | 'wishlist'
  const [currentView, setCurrentView] = useState<'catalog' | 'tracking' | 'admin' | 'wishlist'>('catalog');

  // Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(500);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  // Selected product for detailed modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Newly placed order ID to auto-focus in tracking view
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | undefined>(undefined);

  // AI Assistant open state
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Load products and categories
  const fetchCatalogData = async () => {
    try {
      setLoading(true);
      const [cats, prods] = await Promise.all([
        api.getCategories(),
        api.getProducts({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          search: searchQuery || undefined,
          inStock: inStockOnly || undefined,
          maxPrice: priceRange < 500 ? priceRange : undefined,
          sortBy,
        }),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error('Failed to load store catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, [selectedCategory, searchQuery, sortBy, inStockOnly, priceRange]);

  const handleOrderSuccess = (placedOrder: Order) => {
    setActiveTrackingOrderId(placedOrder.id);
    setCurrentView('tracking');
  };

  return (
    <div id="shopzone-app" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
      
      {/* Top Main Navigation Header with Language/Country single button & All Products Droplist */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (currentView !== 'catalog') setCurrentView('catalog');
        }}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {currentView === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
            
            {/* Curated Clean Hero Banner */}
            <div className="relative rounded-2xl bg-slate-900 text-white overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80"
                alt="Store Banner"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
              />

              <div className="relative z-20 p-8 sm:p-12 md:p-14 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Collection • {country.flag} {country.name}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  Cosmetics, Fine Jewelry, Costumes & Lifestyle.
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed font-normal">
                  Curated organic beauty, sparkling gemstone jewelry, designer gala dresses, and premium essentials with doorstep delivery in {country.currency} ({country.currencySymbol}).
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      const el = document.getElementById('store-catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-sm transition flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>{t('browseCollection', 'Browse Collection')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsAiAssistantOpen(true)}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-full text-xs font-medium backdrop-blur-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-300" />
                    <span>Ask AI Assistant</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Selector Pills */}
            <div id="store-catalog-section" className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">{t('categories')}</h2>
                <span className="text-xs text-slate-400">{products.length} {t('productsAvailable', 'products available')}</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  id="cat-pill-all"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t('allItems', 'All Items')}
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    id={`cat-pill-${cat.slug}`}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      selectedCategory === cat.slug
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat.slug ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {cat.productCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter & Sorting Controls Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-5">
                {/* In Stock Toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-medium text-slate-700">{t('inStockOnly', 'In Stock')}</span>
                </label>

                {/* Price Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Max Price:</span>
                  <span className="font-semibold text-slate-900">{formatPrice(priceRange)}</span>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="25"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-24 accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400 font-medium">Sort:</span>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-800 rounded-full px-3 py-1 font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                {/* Grid / List layout toggle */}
                <div className="hidden sm:flex items-center border border-slate-200 rounded-full overflow-hidden bg-slate-50 p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-full cursor-pointer transition ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-full cursor-pointer transition ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                    aria-label="List view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Catalog Grid */}
            {loading ? (
              <div className="py-24 text-center text-xs text-slate-400">Loading catalog items...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 p-8 space-y-3 shadow-sm">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-semibold text-slate-800">No products match your criteria</h3>
                <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setPriceRange(500);
                    setInStockOnly(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-5 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* Wishlist View */}
        {currentView === 'wishlist' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
                  <span>Wishlist ({wishlist.length})</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">Saved items you want to purchase later.</p>
              </div>
              <button
                onClick={() => setCurrentView('catalog')}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-full cursor-pointer hover:bg-slate-800"
              >
                Back to Catalog
              </button>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 p-8 space-y-3 shadow-sm">
                <Heart className="w-12 h-12 text-slate-200 mx-auto" />
                <h3 className="text-base font-semibold text-slate-800">Your wishlist is empty</h3>
                <p className="text-xs text-slate-400">Save items you like to review and buy them anytime.</p>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold cursor-pointer"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {wishlist.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Live Order Tracking View */}
        {currentView === 'tracking' && (
          <OrderTrackingView
            initialSelectedOrderId={activeTrackingOrderId}
            onNavigateToCatalog={() => setCurrentView('catalog')}
          />
        )}

        {/* Admin Dashboard Console (Role Protected) */}
        {currentView === 'admin' && (
          <AdminDashboard
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}
      </main>

      {/* Modals and Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <CartDrawer />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <AiShoppingAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />

      <AuthModal />

      {/* Footer */}
      <footer id="main-footer" className="mt-16 bg-white border-t border-slate-100 py-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm tracking-tight">SHOPZONE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated minimal electronics, acoustics, and workspace essentials with direct worldwide delivery.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('catalog')} className="hover:text-slate-900 cursor-pointer">{t('shop')}</button></li>
              <li><button onClick={() => setCurrentView('tracking')} className="hover:text-slate-900 cursor-pointer">{t('trackOrder')}</button></li>
              <li><button onClick={() => setCurrentView('wishlist')} className="hover:text-slate-900 cursor-pointer">Wishlist</button></li>
              <li><button onClick={() => setCurrentView('admin')} className="hover:text-indigo-600 cursor-pointer">Admin Portal</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">Support</h4>
            <ul className="space-y-2 text-xs">
              <li>Live Package Tracking</li>
              <li>30-Day Returns Policy</li>
              <li>Comprehensive Warranty</li>
              <li>support@shopzone.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">Special Offer</h4>
            <p className="text-xs leading-relaxed text-slate-600 mb-2">
              Use coupon <strong className="text-slate-900 font-mono">SAVE20</strong> at checkout for 20% off your purchase.
            </p>
            <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-semibold">
              ✓ {country.flag} Delivering to {country.name}
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© 2026 ShopZone Store. All rights reserved.</p>
          <p>Multi-Currency & Multi-Language E-Commerce Platform</p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LocaleProvider>
        <WishlistProvider>
          <CartProvider>
            <StoreApp />
          </CartProvider>
        </WishlistProvider>
      </LocaleProvider>
    </AuthProvider>
  );
}
