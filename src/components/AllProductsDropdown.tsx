import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Sparkles, Tag, ArrowRight, Package } from 'lucide-react';
import { Product } from '../types';
import { useLocale } from '../context/LocaleContext';

interface AllProductsDropdownProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  className?: string;
}

export const AllProductsDropdown: React.FC<AllProductsDropdownProps> = ({
  products,
  onSelectProduct,
  className = '',
}) => {
  const { formatPrice, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(filterText.toLowerCase()) ||
    p.category.toLowerCase().includes(filterText.toLowerCase()) ||
    p.tags?.some(tag => tag.toLowerCase().includes(filterText.toLowerCase()))
  );

  const handleProductTouch = (product: Product) => {
    setIsOpen(false);
    setFilterText('');

    // Trigger parent product selection (e.g. opening modal)
    onSelectProduct(product);

    // Also attempt smooth scroll to the product element in catalog if present
    setTimeout(() => {
      const el = document.getElementById(`product-card-${product.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-indigo-500', 'ring-offset-2');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-indigo-500', 'ring-offset-2');
        }, 2200);
      }
    }, 150);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Dropdown Trigger Button */}
      <button
        id="all-products-droplist-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-full shadow-2xs transition cursor-pointer active:scale-95"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Package className="w-3.5 h-3.5 text-indigo-600" />
        <span className="truncate max-w-[130px] sm:max-w-[180px]">
          {t('allProducts')} ({products.length})
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
      </button>

      {/* Dropdown Menu List */}
      {isOpen && (
        <div
          id="all-products-droplist-menu"
          className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 sm:w-84 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header & Quick Search */}
          <div className="p-2 border-b border-slate-100">
            <div className="flex items-center justify-between pb-1.5">
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                {t('quickJump')}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {filteredProducts.length} items
              </span>
            </div>
            <div className="relative mt-1">
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter by product name..."
                className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Product Items Scrollable Droplist */}
          <div className="max-h-72 overflow-y-auto py-1 space-y-1 divide-y divide-slate-50">
            {filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching product found.
              </div>
            ) : (
              filteredProducts.map((prod) => (
                <button
                  key={prod.id}
                  id={`droplist-item-${prod.id}`}
                  onClick={() => handleProductTouch(prod)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleProductTouch(prod);
                  }}
                  className="w-full p-2 rounded-xl hover:bg-slate-50 active:bg-indigo-50 text-left flex items-center justify-between gap-2.5 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-indigo-600">
                        {prod.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {prod.category}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          ★ {prod.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-indigo-600 block">
                      {formatPrice(prod.price)}
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-indigo-600 flex items-center gap-0.5 justify-end">
                      View <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
