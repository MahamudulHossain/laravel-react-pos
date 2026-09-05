import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Package, ChevronRight } from 'lucide-react';
import { router, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import cartStore from '@/store/cartStore';

export default function Checkout({ cart: initialCart, cartTotals: initialTotals }) {
    const [cart, setCart] = useState(initialCart);
    const [cartTotals, setCartTotals] = useState(initialTotals);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const { clearCart, getTotal } = cartStore();

    useEffect(() => {
        const totals = getTotal();
        setCartTotals(totals);
    }, [cart]);

    const handlePaymentMethod = (method) => {
        setPaymentMethod(method);
    };

    const handlePlaceOrder = () => {
        if (cart.length === 0) return;
        if (!customerName.trim()) {
            alert('Customer name is required');
            return;
        }

        setIsProcessing(true);

        try {
            const orderData = {
                cart: cart,
                cartTotals: cartTotals,
                payment_method: paymentMethod,
                customer_name: customerName,
                customer_phone: customerPhone,
                notes: notes
            };

            router.post('order', orderData, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setIsProcessing(false);
                    clearCart();
                    // router.visit('/print-order');
                },
                onError: () => {
                    setIsProcessing(false);
                }
            });
        } catch (error) {
            console.error('Order placement error:', error);
            setIsProcessing(false);
        }
    };



    return (
        <AuthenticatedLayout>
            <Head title="Checkout" />
            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="font-display text-2xl font-bold text-ink-900">Checkout</h1>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        <div className="space-y-6 lg:col-span-2">
                            <div className="surface-card p-6">
                                <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-ink-800">
                                    <Package className="h-5 w-5 text-brand-600" />
                                    Order Summary
                                </h2>

                                <div className="max-h-80 space-y-3 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 rounded-xl bg-ink-50 p-3">
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="h-14 w-14 rounded-lg border border-ink-200 bg-white object-cover"
                                            />
                                            <div className="flex-1">
                                                <h4 className="mb-1 text-sm font-semibold text-ink-800">{item.name}</h4>
                                                <p className="text-xs text-ink-600">${item.price.toFixed(2)} each</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-ink-800">x{item.selectedQuantity}</p>
                                                <p className="text-xs tabular-nums text-ink-600">${(item.price * item.selectedQuantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="surface-card p-6">
                                <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-ink-800">
                                    <CreditCard className="h-5 w-5 text-brand-600" />
                                    Payment Method
                                </h2>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <button
                                        onClick={() => handlePaymentMethod('cash')}
                                        className={paymentMethod === 'cash' ? 'cursor-pointer rounded-xl bg-brand-600 p-3 text-white transition duration-200' : 'cursor-pointer rounded-xl border border-ink-200 bg-white p-3 text-ink-900 transition duration-200 hover:border-brand-200'}

                                    >
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="h-5 w-5" />
                                            <div className="text-left">
                                                <h3 className="font-semibold">Cash Payment</h3>
                                                <p className={`text-xs ${paymentMethod === 'cash' ? 'text-white/80' : 'text-ink-500'}`}>Pay at checkout</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handlePaymentMethod('card')}
                                        className={paymentMethod === 'card' ? 'cursor-pointer rounded-xl bg-brand-600 p-3 text-white transition duration-200' : 'cursor-pointer rounded-xl border border-ink-200 bg-white p-3 text-ink-900 transition duration-200 hover:border-brand-200'}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="h-5 w-5" />
                                            <div className="text-left">
                                                <h3 className="font-semibold">Card Payment</h3>
                                                <p className={`text-xs ${paymentMethod === 'card' ? 'text-white/80' : 'text-ink-500'}`}>Pay with card</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info & Payment */}
                        <div className="space-y-6">
                            <div className="sticky top-6 surface-card p-6">
                                <h2 className="mb-4 font-display text-lg font-semibold text-ink-800">Customer Information</h2>

                                <div className="mb-6 space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-ink-700">Customer Name *</label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Enter customer name"
                                            className="w-full rounded-xl border border-ink-300 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-ink-700">Mobile Number</label>
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="Enter mobile number (optional)"
                                            className="w-full rounded-xl border border-ink-300 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-ink-700">Notes</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Any special instructions..."
                                            rows="3"
                                            className="w-full rounded-xl border border-ink-300 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
                                    <h3 className="mb-3 text-sm font-semibold text-ink-800">Order Summary</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-ink-600">Subtotal</span>
                                            <span className="tabular-nums text-ink-800">${cartTotals.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-ink-600">Tax (5%)</span>
                                            <span className="tabular-nums text-ink-800">${cartTotals.tax.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-ink-200 pt-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-semibold text-ink-800">Total</span>
                                                <span className="text-xl font-bold tabular-nums text-brand-700">${cartTotals.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={cart.length === 0 || isProcessing || !customerName.trim() || customerPhone === ''}
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/10 transition-all hover:bg-brand-700 hover:shadow-brand-600/20 disabled:cursor-not-allowed disabled:bg-ink-200"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Place Order
                                                <ChevronRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                    {(!customerName.trim() || customerPhone === '') && (
                                        <p className="mt-2 text-xs text-red-600">Customer name and mobile number is required</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
