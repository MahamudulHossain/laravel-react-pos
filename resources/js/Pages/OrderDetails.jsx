import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { ChevronLeft, Printer, X } from 'lucide-react'

const OrderDetails = ({ order }) => {
    const { flash } = usePage().props;

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

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-brand-50 text-brand-800';
            case 'pending':
                return 'bg-amber-50 text-amber-800';
            case 'cancelled':
                return 'bg-red-50 text-red-800';
            default:
                return 'bg-ink-100 text-ink-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'pending':
                return 'Pending';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleClose = () => {
        router.visit(route('pos.indexOrders'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="page-title">
                        Order Details
                    </h2>
                    <Link href={route('pos.indexOrders')} className="flex items-center text-sm font-semibold text-brand-700 hover:text-brand-600">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back to Orders
                    </Link>
                </div>
            }
        >

            <Head title={`Order #${order.custom_order_id}`} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash.success && (
                        <div className="flash-success">
                            {flash.success}
                        </div>
                    )}

                    <div className="print:hidden fixed top-4 right-4 flex gap-2">
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

                    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card print:rounded-none print:border-ink-400 print:shadow-none">
                        <div className="bg-ink-900 p-6 text-white print:bg-ink-800">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="mb-2 font-display text-3xl font-bold">Order Details</h1>
                                    <p className="text-sm text-ink-300">#{order.custom_order_id}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`rounded-full px-3 py-1 text-sm font-semibold text-ink-800 ${getStatusClass('completed')}`}>
                                        {getStatusLabel('completed')}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 space-y-1 text-sm text-ink-300">
                                <p>Date: {formatDate(order.created_at)}</p>
                                <p>Time: {formatTime(order.created_at)}</p>
                            </div>
                        </div>

                        <div className="border-b border-ink-200 p-6 print:border-ink-400">
                            <h3 className="mb-3 font-display text-lg font-semibold text-ink-800">Customer Information</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm text-ink-500">Customer Name</label>
                                    <p className="font-medium text-ink-800">{order.customer_name}</p>
                                </div>
                                {order.customer_phone && (
                                    <div>
                                        <label className="text-sm text-ink-500">Mobile Number</label>
                                        <p className="font-medium text-ink-800">{order.customer_phone}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm text-ink-500">Payment Method</label>
                                    <p className="font-medium text-ink-800">
                                        {getPaymentMethodLabel(order.payment_method)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-ink-200 p-6 print:border-ink-400">
                            <h3 className="mb-4 font-display text-lg font-semibold text-ink-800">Order Items</h3>
                            <div className="space-y-3">
                                {order.details?.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between rounded-xl bg-ink-50 p-4 print:bg-ink-100">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-ink-800">{item.product?.name}</h4>
                                            <p className="mt-1 text-sm text-ink-500">
                                                Quantity: {item.selected_quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold tabular-nums text-ink-800">
                                                ${(item.selected_quantity * item.product?.price).toFixed(2)}
                                            </p>
                                            <p className="text-sm tabular-nums text-ink-500">
                                                ${item.product?.price.toFixed(2)} each
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-ink-50 p-6 print:bg-ink-100">
                            <h3 className="mb-4 font-display text-lg font-semibold text-ink-800">Financial Summary</h3>
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

                        {order.notes && (
                            <div className="border-t border-ink-200 p-6 print:border-ink-400">
                                <h3 className="mb-2 font-display text-lg font-semibold text-ink-800">Notes</h3>
                                <p className="text-sm italic text-ink-500">
                                    {order.notes}
                                </p>
                            </div>
                        )}

                        <div className="bg-brand-50 p-6 text-center print:bg-ink-800 print:text-ink-300">
                            <p className="text-sm text-brand-700 print:text-ink-400">
                                Thank you for your business!
                            </p>
                            <p className="mt-1 text-xs text-brand-600 print:text-ink-500">
                                Printed on {formatDate(new Date())} at {formatTime(new Date())}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{'{\n        @media print {\n          body {\n            margin: 0;\n            padding: 0;\n            background: white;\n          }\n\n          .print\\:hidden {\n            display: none;\n          }\n\n          .print\\:block {\n            display: block;\n          }\n\n          .print\\:max-w-full {\n            max-width: 100%;\n          }\n\n          .print\\:shadow-none {\n            box-shadow: none;\n          }\n\n          .print\\:rounded-none {\n            border-radius: 0;\n          }\n\n          .print\\:border-gray-400 {\n            border-color: #d1d5db;\n          }\n\n          .print\\:bg-gray-800 {\n            background-color: #1f2937;\n          }\n\n          .print\\:text-gray-900 {\n            color: #111827;\n          }\n\n          .print\\:text-gray-400 {\n            color: #9ca3af;\n          }\n\n          .print\\:text-gray-500 {\n            color: #6b7280;\n          }\n\n          .print\\:bg-green-600 {\n            background-color: #16a34a;\n          }\n\n          .print\\:bg-gray-100 {\n            background-color: #f3f4f6;\n          }\n\n          @page {\n            margin: 1cm;\n            size: A4;\n          }\n        }\n      }'}</style>
        </AuthenticatedLayout>
    );
}

export default OrderDetails;
