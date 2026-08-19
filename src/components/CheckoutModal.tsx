import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  CreditCard,
  ShieldCheck,
  MapPin,
  Truck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Home,
  Briefcase,
  Building2,
  Phone,
  Clock,
  FileText,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useCart, SHIPPING_OPTIONS } from '../context/CartContext';
import { useLocale, COUNTRIES } from '../context/LocaleContext';
import { api } from '../services/api';
import { Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { user } = useAuth();
  const {
    items,
    subtotal,
    discount,
    appliedCoupon,
    selectedShipping,
    setSelectedShipping,
    shippingFee,
    tax,
    total,
    clearCart,
  } = useCart();

  const { country, formatPrice, t, setCountry } = useLocale();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Address Type
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('home');

  // Form states
  const [shippingForm, setShippingForm] = useState({
    fullName: user?.name || 'Priya Sharma',
    email: user?.email || 'priya.sharma@example.com',
    phoneCode: country.phoneCode,
    phone: user?.phone || '9876543210',
    flatNo: 'Flat 402, Lotus Towers',
    street: user?.address?.street || 'MG Road, Indiranagar',
    landmark: 'Near Metro Station',
    city: user?.address?.city || (country.code === 'IN' ? 'Bengaluru' : 'Seattle'),
    state: user?.address?.state || (country.code === 'IN' ? 'Karnataka' : 'WA'),
    zipCode: user?.address?.zipCode || (country.code === 'IN' ? '560038' : '98101'),
    country: country.name,
    deliverySlot: 'morning',
    deliveryInstructions: 'Ring doorbell twice. If not available, leave with building security desk.',
    saveAddress: true,
  });

  // Keep country in sync with locale context
  useEffect(() => {
    setShippingForm(prev => ({
      ...prev,
      country: country.name,
      phoneCode: country.phoneCode,
      zipCode: prev.zipCode || (country.code === 'IN' ? '560001' : '98101'),
      city: prev.city || (country.code === 'IN' ? 'Mumbai' : 'New York'),
      state: prev.state || (country.code === 'IN' ? 'Maharashtra' : 'NY'),
    }));
  }, [country]);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'apple_pay' | 'paypal' | 'cod'>(
    country.code === 'IN' ? 'upi' : 'card'
  );

  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardForm, setCardForm] = useState({
    number: '4242 •••• •••• 4242',
    holder: user?.name || 'Priya Sharma',
    expiry: '12/28',
    cvv: '888',
  });

  if (!isOpen) return null;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const handleQuickAddressFill = (preset: 'home' | 'work') => {
    setAddressType(preset);
    if (preset === 'home') {
      setShippingForm(prev => ({
        ...prev,
        flatNo: 'Flat 402, Green Valley Apts',
        street: '12th Cross, Indiranagar',
        landmark: 'Opposite Central Park',
        city: country.code === 'IN' ? 'Bengaluru' : 'San Francisco',
        state: country.code === 'IN' ? 'Karnataka' : 'CA',
        zipCode: country.code === 'IN' ? '560038' : '94102',
        deliveryInstructions: 'Please ring bell upon delivery.',
      }));
    } else {
      setShippingForm(prev => ({
        ...prev,
        flatNo: 'Unit 8B, Tech Park Tower 2',
        street: 'Electronic City Phase 1',
        landmark: 'Beside Innovation Hub',
        city: country.code === 'IN' ? 'Bengaluru' : 'Seattle',
        state: country.code === 'IN' ? 'Karnataka' : 'WA',
        zipCode: country.code === 'IN' ? '560100' : '98104',
        deliveryInstructions: 'Deliver to main reception desk, 8th floor.',
      }));
    }
  };

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setCountry(code);
  };

  const handlePlaceOrder = async () => {
    if (!shippingForm.fullName || !shippingForm.street || !shippingForm.city || !shippingForm.zipCode) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const fullStreet = `${shippingForm.flatNo ? shippingForm.flatNo + ', ' : ''}${shippingForm.street}${shippingForm.landmark ? ' (Landmark: ' + shippingForm.landmark + ')' : ''}`;

      const orderPayload = {
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        shippingAddress: {
          fullName: shippingForm.fullName,
          email: shippingForm.email,
          phone: `${shippingForm.phoneCode} ${shippingForm.phone}`,
          street: fullStreet,
          city: shippingForm.city,
          state: shippingForm.state,
          zipCode: shippingForm.zipCode,
          country: shippingForm.country,
        },
        couponCode: appliedCoupon?.code,
        paymentMethod:
          paymentMethod === 'card'
            ? `Credit Card (${cardForm.number.slice(-8)})`
            : paymentMethod === 'upi'
            ? `UPI / GPay / PhonePe (${upiId})`
            : paymentMethod === 'apple_pay'
            ? 'Apple Pay'
            : paymentMethod === 'paypal'
            ? 'PayPal'
            : 'Cash on Delivery (COD)',
        shippingOption: selectedShipping,
      };

      const placedOrder = await api.checkout(orderPayload);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#6366f1', '#0f172a'],
      });

      clearCart();
      onClose();
      onOrderSuccess(placedOrder);
    } catch (err: any) {
      setErrorMessage(err.message || 'Checkout failed. Please check your details and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="checkout-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="checkout-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-slate-900">{t('checkout')} • {country.flag} {country.name}</span>
          </div>
          <button
            id="close-checkout-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
              currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              1
            </span>
            <span className={currentStep === 1 ? 'font-semibold text-slate-900' : 'text-slate-500'}>
              {t('shippingAddress')}
            </span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
              currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </span>
            <span className={currentStep === 2 ? 'font-semibold text-slate-900' : 'text-slate-500'}>
              {t('deliveryOptions')}
            </span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
              currentStep === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              3
            </span>
            <span className={currentStep === 3 ? 'font-semibold text-slate-900' : 'text-slate-500'}>
              {t('paymentMethod')} & {t('total')}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: Rich Delivery Address Entry */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Header & Quick Address Selection */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">{t('shippingAddress')}</h3>
                </div>
                {/* Saved Address Quick Fill Pills */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400">Quick Fill:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickAddressFill('home')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition cursor-pointer"
                  >
                    🏠 Home
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAddressFill('work')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition cursor-pointer"
                  >
                    🏢 Office
                  </button>
                </div>
              </div>

              {/* Address Type Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">{t('addressType')}</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAddressType('home')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      addressType === 'home'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>{t('home')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddressType('work')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      addressType === 'work'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{t('work')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddressType('other')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      addressType === 'other'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{t('other')}</span>
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('fullName')} *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingForm.fullName}
                    onChange={handleShippingChange}
                    required
                    placeholder="Recipient's full legal name"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('emailAddress')} *</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingForm.email}
                    onChange={handleShippingChange}
                    required
                    placeholder="For tracking updates & invoice"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Phone Number with Country Dial Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('phoneNumber')} *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-xs font-semibold bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-600">
                      {shippingForm.phoneCode}
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingForm.phone}
                      onChange={handleShippingChange}
                      required
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-r-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Country Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('country')} *</label>
                  <select
                    value={country.code}
                    onChange={handleCountrySelect}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900 cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.currency} {c.currencySymbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Flat / House No / Apartment */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('flatAptNo')} *</label>
                  <input
                    type="text"
                    name="flatNo"
                    value={shippingForm.flatNo}
                    onChange={handleShippingChange}
                    required
                    placeholder="e.g. Flat 402, 4th Floor, Skyline Apartments"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Street / Area / Colony */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('streetAddress')} *</label>
                  <input
                    type="text"
                    name="street"
                    value={shippingForm.street}
                    onChange={handleShippingChange}
                    required
                    placeholder="e.g. 100ft Road, Defence Colony"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={shippingForm.landmark}
                    onChange={handleShippingChange}
                    placeholder="e.g. Near City Hospital / Opposite Park"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('city')} *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingForm.city}
                    onChange={handleShippingChange}
                    required
                    placeholder="e.g. Bengaluru, Mumbai, Seattle"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* State & PIN Code */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{country.addressFormat.stateLabel} *</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingForm.state}
                      onChange={handleShippingChange}
                      required
                      placeholder="State / Province"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{country.addressFormat.zipLabel} *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingForm.zipCode}
                      onChange={handleShippingChange}
                      required
                      placeholder={country.addressFormat.zipPlaceholder}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Delivery Instructions */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('instructions')}</label>
                  <textarea
                    name="deliveryInstructions"
                    value={shippingForm.deliveryInstructions}
                    onChange={handleShippingChange}
                    rows={2}
                    placeholder={t('instructionsPlaceholder')}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Options & Time Slot */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Truck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">{t('deliveryOptions')}</h3>
              </div>

              {/* Shipping Speed Options */}
              <div className="space-y-3">
                {SHIPPING_OPTIONS.map((opt) => {
                  const isSelected = selectedShipping.id === opt.id;
                  const priceLabel = opt.price === 0 ? (subtotal >= 100 ? 'FREE' : formatPrice(8.99)) : formatPrice(opt.price);
                  return (
                    <label
                      key={opt.id}
                      onClick={() => setSelectedShipping(opt)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{opt.name}</p>
                          <p className="text-[11px] text-slate-500">{opt.time} • Live GPS Tracking to {shippingForm.city}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">{priceLabel}</span>
                    </label>
                  );
                })}
              </div>

              {/* Delivery Slot Choice */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Preferred Delivery Time Window</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'morning', label: 'Morning Slot (8 AM - 1 PM)' },
                    { id: 'evening', label: 'Evening Slot (2 PM - 8 PM)' },
                    { id: 'anytime', label: 'Anytime / Express Delivery' },
                  ].map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setShippingForm({ ...shippingForm, deliverySlot: slot.id })}
                      className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                        shippingForm.deliverySlot === slot.id
                          ? 'border-indigo-600 bg-white text-indigo-700 font-semibold shadow-xs'
                          : 'border-slate-200 bg-white/60 text-slate-600 hover:bg-white'
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method & Localized Review */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Payment Methods */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">{t('paymentMethod')}</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {country.code === 'IN' && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-sm font-black block mb-1">⚡ UPI / GPay</span>
                      <span className="text-[11px] font-semibold block">PhonePe / Paytm</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-semibold block">Card (Visa/Master)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      paymentMethod === 'apple_pay'
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-sm font-bold block mb-1"> Pay</span>
                    <span className="text-xs font-semibold block">Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-sm font-bold block mb-1">💵 COD</span>
                    <span className="text-xs font-semibold block">Cash on Delivery</span>
                  </button>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-700">Enter UPI ID / VPA</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@upi or name@okaxis"
                        className="flex-1 px-3 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center">
                        Instant 0% Fee
                      </span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardForm.number}
                        onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardForm.expiry}
                          onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary Confirmation in Local Currency */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Ship To:</span>
                  <span className="font-semibold text-slate-900 text-right truncate max-w-[220px]">
                    {shippingForm.flatNo}, {shippingForm.street}, {shippingForm.city} ({country.flag})
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Shipping Speed:</span>
                  <span className="font-semibold text-slate-900">{selectedShipping.name}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{t('subtotal')} ({items.reduce((s, i) => s + i.quantity, 0)} items):</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-medium">
                    <span>{t('discount')} ({appliedCoupon?.code}):</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Shipping Fee:</span>
                  <span className="font-semibold text-slate-900">
                    {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{t('tax')}:</span>
                  <span className="font-semibold text-slate-900">{formatPrice(tax)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>{t('total')}:</span>
                  <span className="text-base font-extrabold text-indigo-600">{formatPrice(total, { showCurrencyCode: true })}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls */}
        <div className="p-5 border-t border-slate-100 bg-white flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1) as 1 | 2)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              id="checkout-next-step-btn"
              onClick={() => setCurrentStep((currentStep + 1) as 2 | 3)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              id="confirm-place-order-btn"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-full flex items-center gap-2 shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <span>Authorizing Payment...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t('placeOrder')} • {formatPrice(total)}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
