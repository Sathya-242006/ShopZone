import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocale } from '../context/LocaleContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    appliedCoupon,
    couponCodeInput,
    setCouponCodeInput,
    applyCoupon,
    removeCoupon,
    couponError,
    couponSuccess,
  } = useCart();

  const { formatPrice, t } = useLocale();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 100;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        id="cart-drawer-content"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Cart</h2>
              <p className="text-xs text-slate-400">{items.reduce((s, i) => s + i.quantity, 0)} items</p>
            </div>
          </div>
          <button
            id="close-cart-btn"
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Milestone Indicator */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              {remainingForFreeShipping === 0
                ? `${t('freeShipping', 'Free Express Shipping')} unlocked!`
                : `Add ${formatPrice(remainingForFreeShipping)} more for ${t('freeShipping', 'Free Shipping')}`}
            </span>
            <span className="text-[11px] text-indigo-600 font-bold">{freeShippingProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List: Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Explore our catalog to find clean, minimalist performance gear.
              </p>
              <button
                id="cart-empty-explore-btn"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                id={`cart-item-${item.product.id}`}
                className="flex gap-3 p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition"
              >
                {/* Product Image */}
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {item.product.title}
                    </h4>
                    <button
                      id={`remove-cart-item-${item.product.id}`}
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Price */}
                    <span className="text-xs font-bold text-indigo-600">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold text-slate-900 min-w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Coupon Code + Summary + Checkout CTA */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-white space-y-3">
            {/* Promo Code Input */}
            <div className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="cart-coupon-input"
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="Promo code (e.g. SAVE20)"
                    disabled={Boolean(appliedCoupon)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs uppercase font-mono bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
                {appliedCoupon ? (
                  <button
                    onClick={removeCoupon}
                    className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-full border border-rose-200 cursor-pointer"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    id="apply-coupon-btn"
                    onClick={() => applyCoupon()}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold cursor-pointer"
                  >
                    Apply
                  </button>
                )}
              </div>

              {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
              {couponSuccess && (
                <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                  <Check className="w-3 h-3" /> {couponSuccess}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>{t('discount')} ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('tax')}</span>
                <span className="font-semibold text-slate-900">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>{t('total')}</span>
                <span className="text-base text-indigo-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-98 cursor-pointer"
            >
              <span>{t('checkout')} ({items.reduce((s, i) => s + i.quantity, 0)}) • {formatPrice(total)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
