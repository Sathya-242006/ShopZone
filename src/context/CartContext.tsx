import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { api } from '../services/api';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  appliedCoupon: Coupon | null;
  couponCodeInput: string;
  couponError: string | null;
  couponSuccess: string | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  selectedShipping: { id: string; name: string; price: number; time: string };
  setSelectedShipping: (opt: { id: string; name: string; price: number; time: string }) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, selectedOption?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setCouponCodeInput: (code: string) => void;
  applyCoupon: (code?: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const FREE_SHIPPING_THRESHOLD = 100;

export const SHIPPING_OPTIONS = [
  { id: 'standard', name: 'ZoneStandard Ground', price: 0, time: '3-5 Business Days' },
  { id: 'express', name: 'ZoneExpress 2-Day Air', price: 9.99, time: '2 Business Days' },
  { id: 'priority', name: 'Priority Overnight Saver', price: 19.99, time: 'Next Day by 12 PM' },
];

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopzone_cart') || localStorage.getItem('shopnova_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[0]);

  useEffect(() => {
    try {
      localStorage.setItem('shopzone_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = Math.round(
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * 100
  ) / 100;

  const discount = appliedCoupon
    ? Math.round(((subtotal * appliedCoupon.discountPercentage) / 100) * 100) / 100
    : 0;

  const effectiveSubtotal = Math.max(0, subtotal - discount);

  // If standard shipping is selected and subtotal < 100, standard is $8.99, otherwise $0
  const shippingFee =
    selectedShipping.id === 'standard'
      ? subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
        ? 0
        : 8.99
      : selectedShipping.price;

  const tax = subtotal > 0 ? Math.round(effectiveSubtotal * 0.0825 * 100) / 100 : 0;
  const total = subtotal > 0 ? Math.round((effectiveSubtotal + shippingFee + tax) * 100) / 100 : 0;

  const addToCart = (product: Product, quantity = 1, selectedOption?: string) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          selectedOption: selectedOption || updated[existingIndex].selectedOption,
        };
        return updated;
      } else {
        return [...prevItems, { product, quantity: Math.min(product.stock, Math.max(1, quantity)), selectedOption }];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock || 99;
          return { ...item, quantity: Math.min(maxStock, quantity) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponError(null);
    setCouponSuccess(null);
  };

  const applyCoupon = async (customCode?: string): Promise<boolean> => {
    const code = (customCode || couponCodeInput).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return false;
    }
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.valid && res.coupon) {
        setAppliedCoupon(res.coupon);
        setCouponSuccess(res.message);
        return true;
      } else {
        setCouponError(res.message || 'Invalid coupon code');
        return false;
      }
    } catch {
      setCouponError('Error validating coupon. Please try again.');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess(null);
    setCouponError(null);
    setCouponCodeInput('');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        appliedCoupon,
        couponCodeInput,
        couponError,
        couponSuccess,
        isCartOpen,
        isCheckoutOpen,
        selectedShipping,
        setSelectedShipping,
        setIsCartOpen,
        setIsCheckoutOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setCouponCodeInput,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
