import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, MapPin, Copy, Check, FileText, Search, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { InvoiceModal } from './InvoiceModal';

interface OrderTrackingViewProps {
  initialSelectedOrderId?: string;
  onNavigateToCatalog: () => void;
}

const STATUS_STEPS: Array<{ key: OrderStatus; label: string; desc: string }> = [
  { key: 'Pending', label: 'Order Placed', desc: 'Payment verified & authorized' },
  { key: 'Processing', label: 'Processing', desc: 'Item picked & packed at warehouse' },
  { key: 'Shipped', label: 'Shipped', desc: 'Departed sorting facility in transit' },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier on local delivery route' },
  { key: 'Delivered', label: 'Delivered', desc: 'Package delivered to recipient' },
];

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialSelectedOrderId,
  onNavigateToCatalog,
}) => {
  const { role } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingSearchInput, setTrackingSearchInput] = useState('');
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const list = await api.getOrders();
      setOrders(list);

      if (initialSelectedOrderId) {
        const found = list.find(o => o.id === initialSelectedOrderId || o.orderNumber === initialSelectedOrderId);
        if (found) {
          setSelectedOrder(found);
          return;
        }
      }

      if (list.length > 0 && !selectedOrder) {
        setSelectedOrder(list[0]);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [initialSelectedOrderId]);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingSearchInput.trim()) return;

    const term = trackingSearchInput.trim().toUpperCase();
    const found = orders.find(
      o =>
        o.orderNumber.toUpperCase().includes(term) ||
        o.trackingNumber.toUpperCase().includes(term) ||
        o.id.toUpperCase().includes(term)
    );

    if (found) {
      setSelectedOrder(found);
    } else {
      setStatusFeedback(`No order found matching "${trackingSearchInput}". Please check your order number.`);
      setTimeout(() => setStatusFeedback(null), 4000);
    }
  };

  const handleCopyTracking = (trk: string) => {
    navigator.clipboard.writeText(trk);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  // Status simulation advancement
  const handleAdvanceStatus = async () => {
    if (!selectedOrder) return;
    const currentIdx = STATUS_STEPS.findIndex(s => s.key === selectedOrder.orderStatus);
    if (currentIdx < STATUS_STEPS.length - 1) {
      const nextStep = STATUS_STEPS[currentIdx + 1];
      setUpdatingStatus(true);
      try {
        const updated = await api.updateOrderStatus(selectedOrder.id, nextStep.key);
        setSelectedOrder(updated);
        setOrders(prev => prev.map(o => (o.id === updated.id ? updated : o)));
        setStatusFeedback(`Order status updated to "${nextStep.label}"!`);
        setTimeout(() => setStatusFeedback(null), 3000);
      } catch (err) {
        console.error('Failed to advance status', err);
      } finally {
        setUpdatingStatus(false);
      }
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.findIndex(s => s.key === status);
  };

  const currentStepIdx = selectedOrder ? getStepIndex(selectedOrder.orderStatus) : 0;

  return (
    <div id="order-tracking-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Tracking</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time fulfillment tracking and order history.
          </p>
        </div>

        {/* Search Order Number Box */}
        <form onSubmit={handleSearchOrder} className="flex gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <input
              id="order-search-input"
              type="text"
              value={trackingSearchInput}
              onChange={(e) => setTrackingSearchInput(e.target.value)}
              placeholder="Search Order # or Tracking #"
              className="w-full pl-9 pr-3 py-2 bg-white text-xs text-slate-900 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-xs cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      {statusFeedback && (
        <div className="mb-6 p-3 bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-xl text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No orders found yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't placed any orders yet. Discover our latest arrivals in the catalog.
          </p>
          <button
            onClick={onNavigateToCatalog}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold cursor-pointer"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Order Selector List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Your Orders ({orders.length})
            </h3>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {orders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                return (
                  <div
                    key={ord.id}
                    id={`order-select-card-${ord.id}`}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-white border-indigo-600 shadow-md ring-1 ring-indigo-600'
                        : 'bg-white hover:bg-slate-50/60 border-slate-100 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-xs text-slate-900">{ord.orderNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ord.orderStatus === 'Out for Delivery'
                          ? 'bg-indigo-50 text-indigo-700'
                          : ord.orderStatus === 'Shipped'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span>{ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}</span>
                      <span>•</span>
                      <span className="font-bold text-slate-900">${ord.total.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      <span>{new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-slate-600 font-medium">Est: {ord.estimatedDelivery}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Live Tracking Showcase */}
          {selectedOrder && (
            <div className="lg:col-span-2 space-y-6">
              
              {/* Order Status Header Card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
                
                {/* Header Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">Order {selectedOrder.orderNumber}</h2>
                      <span className="text-xs text-slate-400">
                        • {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">Carrier:</span>
                      <span className="text-xs font-semibold text-slate-700">{selectedOrder.carrier}</span>
                      <span className="text-slate-200">|</span>
                      <span className="text-xs text-slate-400">Tracking:</span>
                      <button
                        onClick={() => handleCopyTracking(selectedOrder.trackingNumber)}
                        className="text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                        title="Click to copy tracking ID"
                      >
                        <span>{selectedOrder.trackingNumber}</span>
                        {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                    </div>
                  </div>

                  {/* Actions: Print Invoice & Simulate Advance */}
                  <div className="flex items-center gap-2">
                    <button
                      id="view-invoice-btn"
                      onClick={() => setIsInvoiceOpen(true)}
                      className="px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Invoice</span>
                    </button>

                    {selectedOrder.orderStatus !== 'Delivered' && selectedOrder.orderStatus !== 'Cancelled' && (
                      <button
                        id="advance-status-btn"
                        onClick={handleAdvanceStatus}
                        disabled={updatingStatus}
                        className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
                        title="Simulate advance in delivery status"
                      >
                        <Truck className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Advance Status</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Stepper Visual */}
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    {/* Background Connecting Line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0" />
                    {/* Active Filled Line */}
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full z-0 transition-all duration-500"
                      style={{
                        width: `${(Math.max(0, currentStepIdx) / (STATUS_STEPS.length - 1)) * 100}%`,
                      }}
                    />

                    {/* Step Nodes */}
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx < currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div key={step.key} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isCompleted
                                ? 'bg-indigo-600 text-white'
                                : isCurrent
                                ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                                : 'bg-white border-2 border-slate-200 text-slate-400'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-4 h-4" />
                            ) : isCurrent ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-bold">{idx + 1}</span>
                            )}
                          </div>
                          <span className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                            isCurrent ? 'text-slate-900 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expected Delivery Banner */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {selectedOrder.orderStatus === 'Delivered' ? 'Delivered' : 'Estimated Delivery'}
                      </p>
                      <p className="text-xs text-slate-500">{selectedOrder.estimatedDelivery}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                    {selectedOrder.carrier}
                  </span>
                </div>

                {/* Detailed Checkpoint Timeline */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Tracking Milestones
                  </h4>

                  <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {selectedOrder.statusHistory.map((checkpoint, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{checkpoint.status}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(checkpoint.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(checkpoint.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{checkpoint.note}</p>
                          {checkpoint.location && (
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{checkpoint.location}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Order Items Breakdown & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Items */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Package Items
                  </h4>
                  <div className="space-y-2.5">
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <img
                          src={it.image}
                          alt={it.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">{it.title}</p>
                          <p className="text-[11px] text-slate-400">Qty: {it.quantity} • ${it.price.toFixed(2)} ea</p>
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          ${(it.price * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address & Payment Summary */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Destination & Payment
                  </h4>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-900">{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                    <p className="text-slate-400 pt-1">Contact: {selectedOrder.shippingAddress.phone || selectedOrder.customerEmail}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs">
                    <span className="font-semibold text-slate-700">Payment Method: </span>
                    <span className="text-slate-900">{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Printable Invoice Modal */}
      <InvoiceModal
        order={selectedOrder}
        onClose={() => setIsInvoiceOpen(false)}
      />

    </div>
  );
};
