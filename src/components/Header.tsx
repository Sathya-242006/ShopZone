import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Heart,
  Package,
  ShieldCheck,
  User,
  Sparkles,
  X,
  ArrowRightLeft,
  Menu,
  LogOut,
  ChevronDown,
  Globe,
  Edit3,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocale } from '../context/LocaleContext';
import { Product } from '../types';
import { LanguageCountryModal } from './LanguageCountryModal';
import { AllProductsDropdown } from './AllProductsDropdown';

interface HeaderProps {
  currentView: 'catalog' | 'tracking' | 'admin' | 'wishlist';
  onNavigate: (view: 'catalog' | 'tracking' | 'admin' | 'wishlist') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAiAssistant: () => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenAiAssistant,
  products = [],
  onSelectProduct,
}) => {
  const { user, role, switchRole, setIsAuthModalOpen, setAuthModalTab, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { country, t } = useLocale();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLocaleModalOpen, setIsLocaleModalOpen] = useState(false);

  const toggleRole = () => {
    const nextRole = role === 'admin' ? 'customer' : 'admin';
    switchRole(nextRole);
    if (nextRole === 'admin') {
      onNavigate('admin');
    } else if (currentView === 'admin') {
      onNavigate('catalog');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-colors">
      {/* Top Banner for Promo, Country & Currency + Role Notification */}
      <div id="promo-banner" className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Offer & Currency info */}
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0">
              Offer
            </span>
            <span className="truncate text-slate-300 text-[11px] sm:text-xs">
              Use code <strong className="text-white font-mono tracking-wide">SAVE20</strong> for 20% off • Global Delivery
            </span>
          </div>

          {/* Right: Language/Country Single Button + Role Switch */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Single Language & Country Button */}
            <button
              id="header-locale-trigger-btn"
              onClick={() => setIsLocaleModalOpen(true)}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-0.5 rounded-full border border-slate-700 transition cursor-pointer active:scale-95"
              title="Click to select Country & Currency"
            >
              <Globe className="w-3 h-3 text-indigo-400" />
              <span className="font-semibold text-white">{country.flag} {country.name}</span>
              <span className="text-emerald-400 font-mono font-bold">({country.currencySymbol} {country.currency})</span>
              <span className="text-slate-400 hidden sm:inline">• English</span>
            </button>

            {/* Quick Role Switch */}
            <button
              id="role-quick-toggle-btn"
              onClick={toggleRole}
              className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-0.5 rounded-full border border-slate-700 transition cursor-pointer"
              title="Click to quickly switch between Admin (Sathya) & Customer roles"
            >
              <ArrowRightLeft className="w-3 h-3 text-indigo-400" />
              <span>
                Role: <strong className={role === 'admin' ? 'text-indigo-400' : 'text-emerald-400'}>{role === 'admin' ? 'Admin (Sathya)' : 'Customer'}</strong>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">
          
          {/* Logo & Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              id="brand-logo-btn"
              onClick={() => onNavigate('catalog')}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <span className="text-2xl font-black tracking-tighter text-indigo-600 uppercase">ShopZone</span>
            </button>

            {/* All Products Droplist Selector */}
            {products.length > 0 && (
              <div className="hidden sm:block">
                <AllProductsDropdown
                  products={products}
                  onSelectProduct={(p) => {
                    if (onSelectProduct) onSelectProduct(p);
                    if (currentView !== 'catalog') onNavigate('catalog');
                  }}
                />
              </div>
            )}

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
              <button
                id="nav-catalog-btn"
                onClick={() => onNavigate('catalog')}
                className={`transition cursor-pointer ${
                  currentView === 'catalog'
                    ? 'text-slate-900 font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                {t('shop')}
              </button>

              <button
                id="nav-tracking-btn"
                onClick={() => onNavigate('tracking')}
                className={`transition cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'tracking'
                    ? 'text-slate-900 font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span>{t('trackOrder')}</span>
              </button>

              {role === 'admin' && (
                <button
                  id="nav-admin-btn"
                  onClick={() => onNavigate('admin')}
                  className={`transition flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'admin'
                      ? 'text-indigo-600 font-semibold'
                      : 'text-indigo-600/80 hover:text-indigo-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Admin Console</span>
                </button>
              )}
            </nav>
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-xs lg:max-w-sm hidden md:block">
            <div className="relative">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-slate-50 border-none rounded-full py-2 pl-9 pr-8 text-xs sm:text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition text-slate-900 placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Icons & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* AI Assistant Button */}
            <button
              id="open-ai-assistant-btn"
              onClick={onOpenAiAssistant}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition cursor-pointer"
              title="ShopZone AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>ShopZone AI</span>
            </button>

            {/* Wishlist */}
            <button
              id="header-wishlist-btn"
              onClick={() => onNavigate('wishlist')}
              className={`p-2 rounded-full relative transition cursor-pointer ${
                currentView === 'wishlist'
                  ? 'text-rose-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              aria-label="View Wishlist"
              title="Saved items"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <div className="border-l border-slate-100 pl-3 sm:pl-4 flex items-center gap-3 sm:gap-4">
              <button
                id="header-cart-btn"
                onClick={() => setIsCartOpen(true)}
                className="relative cursor-pointer text-slate-600 hover:text-slate-900 transition p-1"
                aria-label="View shopping cart"
              >
                <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Profile Pill */}
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 rounded-full py-1 pr-3 pl-1 transition cursor-pointer"
                  aria-label="User profile menu"
                >
                  <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    {user?.name ? getInitials(user.name) : 'JD'}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[90px] truncate hidden sm:inline">
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">{user?.name || 'Guest'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || 'No email'}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {role === 'admin' ? '🛡️ Administrator' : '👤 Customer'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{country.flag} {country.currency}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      {/* Language & Country inside menu too */}
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsLocaleModalOpen(true);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span>Country & Currency</span>
                        </span>
                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {country.flag} {country.currency}
                        </span>
                      </button>

                      <button
                        id="dropdown-edit-profile-btn"
                        onClick={() => {
                          setAuthModalTab('profile');
                          setIsAuthModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Edit Customer Profile</span>
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">Editable</span>
                      </button>

                      <button
                        id="dropdown-switch-member-btn"
                        onClick={() => {
                          setAuthModalTab('login');
                          setIsAuthModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Switch Customer / Member</span>
                        </span>
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium">Multi-user</span>
                      </button>

                      <button
                        id="dropdown-switch-role-btn"
                        onClick={() => {
                          toggleRole();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
                          <span>Switch to {role === 'admin' ? 'Customer' : 'Admin (Sathya)'}</span>
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">1-Click</span>
                      </button>

                      <button
                        id="dropdown-orders-btn"
                        onClick={() => {
                          onNavigate('tracking');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        {t('trackOrder')}
                      </button>

                      {role === 'admin' && (
                        <button
                          id="dropdown-admin-btn"
                          onClick={() => {
                            onNavigate('admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-indigo-600 hover:bg-indigo-50/50 flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                          Admin Console
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        id="dropdown-sign-in-out-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (user) {
                            logout();
                          } else {
                            setAuthModalTab('login');
                            setIsAuthModalOpen(true);
                          }
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {user ? 'Sign Out' : 'Sign In / Register'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Mobile Search Bar & Mobile All Products Dropdown */}
        <div className="py-2 pb-3 md:hidden space-y-2">
          {products.length > 0 && (
            <div className="w-full sm:hidden">
              <AllProductsDropdown
                products={products}
                onSelectProduct={(p) => {
                  if (onSelectProduct) onSelectProduct(p);
                  if (currentView !== 'catalog') onNavigate('catalog');
                }}
                className="w-full"
              />
            </div>
          )}
          <div className="relative">
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-full ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMobileNavOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1 animate-in fade-in">
            <button
              onClick={() => {
                onNavigate('catalog');
                setIsMobileNavOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm rounded-lg font-medium flex items-center gap-2 ${
                currentView === 'catalog' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> {t('shop')}
            </button>

            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                setIsLocaleModalOpen(true);
              }}
              className="w-full px-3 py-2 text-left text-sm rounded-lg font-medium flex items-center justify-between text-slate-600 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>Country & Currency</span>
              </span>
              <span className="text-xs font-semibold text-indigo-600">{country.flag} {country.name} ({country.currencySymbol})</span>
            </button>

            <button
              onClick={() => {
                onNavigate('tracking');
                setIsMobileNavOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm rounded-lg font-medium flex items-center gap-2 ${
                currentView === 'tracking' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
              }`}
            >
              <Package className="w-4 h-4" /> {t('trackOrder')}
            </button>
            <button
              onClick={() => {
                onNavigate('wishlist');
                setIsMobileNavOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm rounded-lg font-medium flex items-center gap-2 ${
                currentView === 'wishlist' ? 'bg-rose-50 text-rose-600' : 'text-slate-600'
              }`}
            >
              <Heart className="w-4 h-4" /> Wishlist ({wishlist.length})
            </button>
            {role === 'admin' && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setIsMobileNavOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm rounded-lg font-medium flex items-center gap-2 ${
                  currentView === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'text-indigo-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin Console
              </button>
            )}
          </div>
        )}

      </div>

      {/* Language & Country Switcher Modal */}
      <LanguageCountryModal
        isOpen={isLocaleModalOpen}
        onClose={() => setIsLocaleModalOpen(false)}
      />
    </header>
  );
};
