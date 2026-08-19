import React from 'react';
import { X, Printer, CheckCircle, Package } from 'lucide-react';
import { Order } from '../types';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="invoice-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="invoice-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white print:hidden">
          <span className="text-xs font-bold text-slate-700">Receipt & Invoice</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 space-y-6 overflow-y-auto print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold tracking-tight text-slate-900">STORE</span>
              </div>
              <p className="text-xs text-slate-400">Direct Retail Inc. • 100 Market St</p>
              <p className="text-xs text-slate-400">San Francisco, CA • support@store.com</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-medium uppercase text-slate-400 tracking-wider">Invoice</span>
              <p className="text-base font-bold text-slate-900 font-mono">{order.orderNumber}</p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Customer & Shipping Addresses */}
          <div className="grid grid-cols-2 gap-6 text-xs text-slate-600">
            <div>
              <p className="font-semibold text-slate-900 uppercase tracking-wider text-[10px] mb-1">Billed To</p>
              <p className="font-medium text-slate-800">{order.customerName}</p>
              <p>{order.customerEmail}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>

            <div>
              <p className="font-semibold text-slate-900 uppercase tracking-wider text-[10px] mb-1">Shipped To</p>
              <p className="font-medium text-slate-800">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium text-slate-900">{it.title}</td>
                    <td className="p-3 text-center text-slate-600">{it.quantity}</td>
                    <td className="p-3 text-right text-slate-600">${it.price.toFixed(2)}</td>
                    <td className="p-3 text-right font-semibold text-slate-900">
                      ${(it.price * it.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-indigo-600">
                  <span>Discount ({order.couponCode})</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({order.carrier})</span>
                <span className="font-medium text-slate-900">
                  {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium text-slate-900">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total</span>
                <span className="text-indigo-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            <p>Thank you for your order. Order reference #{order.orderNumber}.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
