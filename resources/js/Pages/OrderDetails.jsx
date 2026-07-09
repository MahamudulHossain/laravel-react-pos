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
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Order Details
                    </h2>
                    <Link href={route('pos.indexOrders')} className="flex items-center text-indigo-600 hover:text-indigo-900">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Orders
                    </Link>
                </div>
            }
        >

            <Head title={`Order #${order.custom_order_id}`} />

            <div className="py-6">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded relative">
                            {flash.success}
                        </div>
                    )}

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

                    <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none border-2 border-gray-200 print:border-gray-400">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 print:bg-gray-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">Order Details</h1>
                                    <p className="text-blue-100 text-sm">#{order.custom_order_id}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass('completed')}`}>
                                        {getStatusLabel('completed')}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 space-y-1 text-sm text-blue-100">
                                <p>Date: {formatDate(order.created_at)}</p>
                                <p>Time: {formatTime(order.created_at)}</p>
                            </div>
                        </div>

                        <div className="p-6 border-b border-gray-200 print:border-gray-400">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-600">Customer Name</label>
                                    <p className="font-medium text-gray-800">{order.customer_name}</p>
                                </div>
                                {order.customer_phone && (
                                    <div>
                                        <label className="text-sm text-gray-600">Mobile Number</label>
                                        <p className="font-medium text-gray-800">{order.customer_phone}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm text-gray-600">Payment Method</label>
                                    <p className="font-medium text-gray-800">
                                        {getPaymentMethodLabel(order.payment_method)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-b border-gray-200 print:border-gray-400">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                            <div className="space-y-3">
                                {order.details?.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg print:bg-gray-100">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">{item.product?.name}</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Quantity: {item.selected_quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800">
                                                ${(item.selected_quantity * item.product?.price).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                ${item.product?.price.toFixed(2)} each
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 print:bg-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Summary</h3>
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

                        {order.notes && (
                            <div className="p-6 border-t border-gray-200 print:border-gray-400">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
                                <p className="text-sm text-gray-600 italic">
                                    {order.notes}
                                </p>
                            </div>
                        )}

                        <div className="p-6 bg-blue-50 print:bg-gray-800 text-center print:text-gray-300">
                            <p className="text-sm text-blue-600 print:text-gray-400">
                                Thank you for your business!
                            </p>
                            <p className="text-xs text-blue-500 mt-1 print:text-gray-500">
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
