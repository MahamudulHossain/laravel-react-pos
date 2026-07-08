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
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Print Header */}
            <div className="hidden print:block mb-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">{app_name}</h1>
                    <p className="text-gray-600">Order #{order.custom_order_id}</p>
                </div>
            </div>

            {/* Close Button (non-print) */}
            <div className="print:hidden fixed top-4 right-4 flex gap-2">
                <button
                    onClick={handlePrint}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Printer className="w-5 h-5" />
                </button>
                <button
                    onClick={handleClose}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Receipt Content */}
            <div
                ref={printRef}
                className="max-w-md mx-auto bg-white print:max-w-full print:shadow-none shadow-lg rounded-2xl overflow-hidden print:rounded-none border-2 border-gray-200 print:border-gray-400"
            >
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 print:bg-gray-800 print:from-gray-800 print:to-gray-800">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-2">POS Receipt</h1>
                        <p className="text-blue-100 text-sm">#{order.custom_order_id}</p>
                        <div className="mt-3 space-y-1 text-xs text-blue-100">
                            <p>Date: {formatDate(order.created_at)}</p>
                            <p>Time: {formatTime(order.created_at)}</p>
                        </div>
                    </div>

                    {successMsg && (
                        <div className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg text-center print:bg-green-600">
                            <p className="font-semibold">{successMsg}</p>
                        </div>
                    )}
                </div>

                {/* Customer Information */}
                <div className="p-6 border-b border-gray-200 print:border-gray-400">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 print:text-gray-900">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium text-gray-800">{order.customer_name}</span>
                        </div>
                        {order.customer_phone && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-medium text-gray-800">{order.customer_phone}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Payment:</span>
                            <span className="font-medium text-gray-800">
                                {getPaymentMethodLabel(order.payment_method)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b border-gray-200 print:border-gray-400">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 print:text-gray-900">Order Items</h3>
                    <div className="space-y-3">
                        {getOrderDetails().map((item) => (
                            <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg print:bg-gray-100">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800 text-sm print:text-gray-900">
                                        {item.product.name}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Qty: {item.selected_quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">
                                        ${(item.selected_quantity * item.product.price).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        ${item.product.price.toFixed(2)} each
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="p-6 bg-gray-50 print:bg-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 print:text-gray-900">Financial Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium text-gray-800">${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax (5%):</span>
                            <span className="font-medium text-gray-800">${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-300 pt-2 mt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-base font-bold text-gray-800">Total:</span>
                                <span className="text-xl font-bold text-blue-600">
                                    ${order.total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {order.notes && (
                    <div className="p-6 border-t border-gray-200 print:border-gray-400">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 print:text-gray-900">Notes</h3>
                        <p className="text-sm text-gray-600 italic print:text-gray-700">
                            {order.notes}
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="p-6 bg-blue-50 print:bg-gray-800 text-center print:text-gray-300">
                    <p className="text-sm text-blue-600 print:text-gray-400">
                        Thank you for your business!
                    </p>
                    <p className="text-xs text-blue-500 mt-1 print:text-gray-500">
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
