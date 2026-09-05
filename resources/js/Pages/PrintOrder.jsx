import React, { useRef, useEffect } from 'react';
import { Printer, X } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function PrintOrder({ order, orderDetails, successMsg, app_name }) {
    const printRef = useRef();

    // Auto-print when component mounts
    useEffect(() => {
        handlePrint();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleClose = () => {
        router.visit('pos');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPaymentMethodLabel = (method) => {
        return method === 'cash' ? 'Cash' : 'Card';
    };

    const getOrderDetails = () => {
        return orderDetails || [];
    };

    return (
        <div className="min-h-screen bg-ink-50 p-4">
            {/* Print Header */}
            <div className="mb-4 hidden print:block">
                <div className="text-center">
                    <h1 className="font-display text-2xl font-bold text-ink-800">{app_name}</h1>
                    <p className="text-ink-500">Order #{order.custom_order_id}</p>
                </div>
            </div>

            {/* Close Button (non-print) */}
            <div className="print:hidden fixed right-4 top-4 flex gap-2">
                <button
                    onClick={handlePrint}
                    className="cursor-pointer rounded-xl bg-brand-600 p-2 text-white transition-colors hover:bg-brand-700"
                >
                    <Printer className="h-5 w-5" />
                </button>
                <button
                    onClick={handleClose}
                    className="cursor-pointer rounded-xl bg-ink-700 p-2 text-white transition-colors hover:bg-ink-800"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Receipt Content */}
            <div
                ref={printRef}
                className="mx-auto max-w-md overflow-hidden rounded-2xl border-2 border-ink-200 bg-white shadow-card print:max-w-full print:rounded-none print:border-ink-400 print:shadow-none"
            >
                {/* Header Section */}
                <div className="bg-ink-900 p-6 text-white print:bg-ink-800">
                    <div className="text-center">
                        <h1 className="mb-2 font-display text-3xl font-bold">POS Receipt</h1>
                        <p className="text-sm text-ink-300">#{order.custom_order_id}</p>
                        <div className="mt-3 space-y-1 text-xs text-ink-300">
                            <p>Date: {formatDate(order.created_at)}</p>
                            <p>Time: {formatTime(order.created_at)}</p>
                        </div>
                    </div>

                    {successMsg && (
                        <div className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-center text-white">
                            <p className="font-semibold">{successMsg}</p>
                        </div>
                    )}
                </div>

                {/* Customer Information */}
                <div className="border-b border-ink-200 p-6 print:border-ink-400">
                    <h3 className="mb-3 font-display text-lg font-semibold text-ink-800 print:text-ink-900">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-ink-500">Name:</span>
                            <span className="font-medium text-ink-800">{order.customer_name}</span>
                        </div>
                        {order.customer_phone && (
                            <div className="flex justify-between">
                                <span className="text-ink-500">Phone:</span>
                                <span className="font-medium text-ink-800">{order.customer_phone}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-ink-500">Payment:</span>
                            <span className="font-medium text-ink-800">
                                {getPaymentMethodLabel(order.payment_method)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="border-b border-ink-200 p-6 print:border-ink-400">
                    <h3 className="mb-4 font-display text-lg font-semibold text-ink-800 print:text-ink-900">Order Items</h3>
                    <div className="space-y-3">
                        {getOrderDetails().map((item) => (
                            <div key={item.id} className="flex items-start justify-between rounded-xl bg-ink-50 p-3 print:bg-ink-100">
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-ink-800 print:text-ink-900">
                                        {item.product.name}
                                    </h4>
                                    <p className="mt-1 text-xs text-ink-500">
                                        Qty: {item.selected_quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold tabular-nums text-ink-800">
                                        ${(item.selected_quantity * item.product.price).toFixed(2)}
                                    </p>
                                    <p className="text-xs tabular-nums text-ink-500">
                                        ${item.product.price.toFixed(2)} each
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-ink-50 p-6 print:bg-ink-100">
                    <h3 className="mb-4 font-display text-lg font-semibold text-ink-800 print:text-ink-900">Financial Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-ink-500">Subtotal:</span>
                            <span className="font-medium tabular-nums text-ink-800">${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-ink-500">Tax (5%):</span>
                            <span className="font-medium tabular-nums text-ink-800">${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="mt-2 border-t border-ink-200 pt-2">
                            <div className="flex items-center justify-between">
                                <span className="text-base font-bold text-ink-800">Total:</span>
                                <span className="text-xl font-bold tabular-nums text-brand-700">
                                    ${order.total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {order.notes && (
                    <div className="border-t border-ink-200 p-6 print:border-ink-400">
                        <h3 className="mb-2 font-display text-lg font-semibold text-ink-800 print:text-ink-900">Notes</h3>
                        <p className="text-sm italic text-ink-500 print:text-ink-700">
                            {order.notes}
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="bg-brand-50 p-6 text-center print:bg-ink-800 print:text-ink-300">
                    <p className="text-sm text-brand-700 print:text-ink-400">
                        Thank you for your business!
                    </p>
                    <p className="mt-1 text-xs text-brand-600 print:text-ink-500">
                        Printed on {formatDate(new Date())} at {formatTime(new Date())}
                    </p>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }

          .print\\:hidden {
            display: none;
          }

          .print\\:block {
            display: block;
          }

          .print\\:max-w-full {
            max-width: 100%;
          }

          .print\\:shadow-none {
            box-shadow: none;
          }

          .print\\:rounded-none {
            border-radius: 0;
          }

          .print\\:border-gray-400 {
            border-color: #d1d5db;
          }

          .print\\:bg-gray-800 {
            background-color: #1f2937;
          }

          .print\\:from-gray-800 {
            --tw-gradient-from: #1f2937;
            --tw-gradient-to: rgba(31, 41, 55, 0);
          }

          .print\\:to-gray-800 {
            --tw-gradient-to: #1f2937;
          }

          .print\\:text-gray-900 {
            color: #111827;
          }

          .print\\:text-gray-400 {
            color: #9ca3af;
          }

          .print\\:text-gray-500 {
            color: #6b7280;
          }

          .print\\:bg-green-600 {
            background-color: #16a34a;
          }

          .print\\:bg-gray-100 {
            background-color: #f3f4f6;
          }

          @page {
            margin: 1cm;
            size: A4;
          }
        }
      `}</style>
        </div>
    );
}
