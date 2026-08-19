import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, CheckCircle2, Send } from 'lucide-react';
import { Product, Review } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocale } from '../context/LocaleContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectProduct,
}) => {
  const { addToCart, items } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice, t } = useLocale();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmittedMessage, setReviewSubmittedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setQuantity(1);
      setReviewSubmittedMessage(null);
      api.getProductDetails(product.id)
        .then(data => {
          setReviews(data.reviews || []);
          setRelated(data.related || []);
        })
        .catch(err => console.error(err));
    }
  }, [product]);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const cartItem = items.find(i => i.product.id === product.id);
  const inCartQty = cartItem?.quantity || 0;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const added = await api.addReview(product.id, newRating, newComment);
      setReviews(prev => [added, ...prev]);
      setNewComment('');
      setReviewSubmittedMessage('Thank you! Your verified review has been published.');
      setTimeout(() => setReviewSubmittedMessage(null), 4000);
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="product-detail-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header Bar with Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {product.category}
          </span>
          <button
            id="close-product-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Column */}
            <div className="space-y-3">
              <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                        activeImageIndex === idx ? 'border-indigo-600 shadow-xs' : 'border-slate-100 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${idx}`}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Summary Column */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md text-amber-900 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    ({product.reviewCount} reviews)
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {product.stock > 0 ? `${product.stock} ${t('inStock', 'in stock')}` : t('outOfStock', 'Out of stock')}
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 leading-snug">
                  {product.title}
                </h1>

                {/* Price Display */}
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-indigo-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-base text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        Save {formatPrice(product.originalPrice - product.price)}
                      </span>
                    </>
                  )}
                </div>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {product.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Purchase Controls */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                {/* Quantity picker */}
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-slate-700">Quantity</span>
                  <div className="flex items-center border border-slate-200 rounded-full overflow-hidden bg-slate-50">
                    <button
                      id="qty-minus-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-30 cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold text-slate-900 min-w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      id="qty-plus-btn"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock || isOutOfStock}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-30 cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    {product.stock} {t('unitsLeft', 'available')}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer ${
                      isOutOfStock
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-98'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? t('outOfStock', 'Currently Out of Stock') : `${t('addToCart', 'Add to Cart')} (${quantity}) • ${formatPrice(product.price * quantity)}`}</span>
                  </button>

                  <button
                    id="modal-toggle-wishlist-btn"
                    onClick={() => toggleWishlist(product)}
                    className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-rose-600 transition cursor-pointer"
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-slate-700" />
                    <span>Express Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-slate-700" />
                    <span>Warranty Included</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-slate-700" />
                    <span>30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation: Specs & Reviews */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex gap-6 border-b border-slate-100 mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2.5 text-sm font-semibold border-b-2 cursor-pointer transition ${
                  activeTab === 'overview' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 text-sm font-semibold border-b-2 cursor-pointer transition flex items-center gap-1.5 ${
                  activeTab === 'reviews' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>Customer Reviews</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.2 rounded-full text-xs font-mono">
                  {reviews.length}
                </span>
              </button>
            </div>

            {/* Specifications Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {product.specs && product.specs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <span className="font-medium text-slate-500">{spec.name}</span>
                        <span className="font-semibold text-slate-900 text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No specific hardware dimensions provided.</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Submit Review Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Write a Review</h4>
                  {reviewSubmittedMessage ? (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{reviewSubmittedMessage}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 font-medium">Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewRating(star)}
                              className="p-0.5 text-amber-400 hover:scale-110 transition cursor-pointer"
                            >
                              <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts on this product..."
                        rows={2}
                        required
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmittingReview || !newComment.trim()}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSubmittingReview ? 'Submitting...' : 'Post Review'}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl border border-slate-100 bg-white space-y-1.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                              alt={rev.userName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-xs font-semibold text-slate-900">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-medium">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-4">No reviews yet for this product.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Related Products Recommendation */}
          {related.length > 0 && (
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3">You May Also Like</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {related.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct(rel)}
                    className="group bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-100 cursor-pointer transition"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-2">
                      <img src={rel.images[0]} alt={rel.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </div>
                    <p className="text-xs font-semibold text-slate-900 truncate">{rel.title}</p>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">{formatPrice(rel.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
