import React from 'react';
import { Star, ShoppingBag, Heart, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocale } from '../context/LocaleContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart, items } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice, t } = useLocale();

  const isFavorited = isInWishlist(product.id);
  const cartItem = items.find(i => i.product.id === product.id);
  const inCartQty = cartItem?.quantity || 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col p-4 cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden mb-4">
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
              New
            </span>
          )}
          {isLowStock && (
            <span className="bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {product.stock} {t('unitsLeft', 'Left')}
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-slate-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {t('outOfStock', 'Sold Out')}
            </span>
          )}
        </div>

        {/* Wishlist & Quick View */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={handleToggleWishlist}
            aria-label="Toggle wishlist"
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600 flex items-center justify-center shadow-xs backdrop-blur-xs transition hover:scale-110"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            id={`quickview-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            aria-label="Quick view product"
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-950 flex items-center justify-center shadow-xs backdrop-blur-xs transition hover:scale-110 opacity-0 group-hover:opacity-100 hidden sm:flex"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Hover Quick Add to Cart button reveal */}
        {!isOutOfStock && inCartQty === 0 && (
          <div className="absolute bottom-3 left-3 right-3 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={handleAddToCart}
              className="w-full bg-slate-900/95 hover:bg-indigo-600 text-white py-2 rounded-xl text-xs font-semibold shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t('addToCart', 'Add to Cart')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[10px] text-slate-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-700 text-xs">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h4 className="font-semibold text-sm text-slate-900 leading-snug line-clamp-1 group-hover:text-indigo-600 transition">
            {product.title}
          </h4>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-normal">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-indigo-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {inCartQty > 0 ? (
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> {inCartQty} in Cart
            </span>
          ) : (
            <button
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`p-2 rounded-xl text-xs font-semibold transition sm:hidden ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400'
                  : 'bg-slate-900 text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
