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
    const [orderId, setOrderId] = useState(null);

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
                onSuccess: (response) => {
                    setIsProcessing(false);
                    if (response.props.order_id) {
                        setOrderId(response.props.order_id);
                    }
                    clearCart();
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
            <div className="py-6">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-indigo-600" />
                                    Order Summary
                                </h2>

                                <div className="space-y-3 max-h-80 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-14 h-14 object-cover rounded-lg bg-white border border-slate-200"
                                            />
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-slate-800 mb-1">{item.name}</h4>
                                                <p className="text-xs text-slate-600">${item.price.toFixed(2)} each</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-slate-800">x{item.selectedQuantity}</p>
                                                <p className="text-xs text-slate-600">${(item.price * item.selectedQuantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-indigo-600" />
                                    Payment Method
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handlePaymentMethod('cash')}
                                        className={paymentMethod === 'cash' ? 'bg-indigo-400 text-white p-3' : 'p-3 bg-white text-black border border-slate-200'}

                                    >
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="w-5 h-5" />
                                            <div className="text-left">
                                                <h3 className="font-semibold">Cash Payment</h3>
                                                <p className="text-xs text-slate-600">Pay at checkout</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handlePaymentMethod('card')}
                                        className= {paymentMethod === 'card' ? 'bg-indigo-400 text-white p-3' : 'p-3 bg-white text-black border border-slate-200'}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-5 h-5" />
                                            <div className="text-left">
                                                <h3 className="font-semibold">Card Payment</h3>
                                                <p className="text-xs text-slate-600">Pay with card</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info & Payment */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">Customer Information</h2>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Customer Name *</label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Enter customer name"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="Enter mobile number (optional)"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Any special instructions..."
                                            rows="3"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 border border-slate-200">
                                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Order Summary</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Subtotal</span>
                                            <span className="text-slate-800">${cartTotals.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Tax (5%)</span>
                                            <span className="text-slate-800">${cartTotals.tax.toFixed(2)}</span>
                                        </div>
                                        <div className="pt-2 border-t border-slate-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base font-semibold text-slate-800">Total</span>
                                                <span className="text-xl font-bold text-indigo-600">${cartTotals.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={cart.length === 0 || isProcessing || !customerName.trim()}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Place Order
                                                <ChevronRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                    {!customerName.trim() && (
                                        <p className="text-xs text-red-600 mt-2">Customer name is required</p>
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
