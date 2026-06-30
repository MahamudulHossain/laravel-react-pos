import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, Trash2, Plus, Minus, Layers } from 'lucide-react';

export default function Pos({categories, dbProducts}) {
    const [products] = useState(dbProducts);
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
// console.log(products);

    // 2. Cart Actions
    const addToCart = (product) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item.id === product.id);
            if (existingItem) {
                if (existingItem.quantity >= product.stock) return currentCart; // Cap at available stock
                return currentCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(currentCart =>
            currentCart.map(item => {
                if (item.id === id) {
                    const newQty = item.quantity + delta;
                    if (newQty <= 0) return null;
                    if (newQty > item.stock) return item; // Cap at stock limit
                    return { ...item, quantity: newQty };
                }
                return item;
            }).filter(Boolean)
        );
    };

    const removeFromCart = (id) => {
        setCart(currentCart => currentCart.filter(item => item.id !== id));
    };

    // 3. Calculations
    const cartTotals = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.05; // 5% VAT example
        const total = subtotal + tax;
        return { subtotal, tax, total };
    }, [cart]);

    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans antialiased text-slate-800 overflow-hidden">

            {/* LEFT SIDE: PRODUCT SECTION */}
            <div className="flex flex-col flex-1 h-full p-6 overflow-hidden">
                {/* Top Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    {/* Category Dropdown */}
                    <div className="relative flex-shrink-0 min-w-[200px]">
                        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                        >
                            <option value="All Categories">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Scan barcode or type product name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {/* Product Grid Area */}
                <div className="flex-1 overflow-y-auto pr-1 pb-4">
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                            <ShoppingBag className="w-12 h-12 mb-2 stroke-1" />
                            <p className="text-sm font-medium">No active products found matching criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.data.map((product) => (

                                <div
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer overflow-hidden relative"
                                >
                                    {/* Image Container */}
                                    <div className="aspect-square w-full bg-slate-100 overflow-hidden relative">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                                            Stock: {product.stock}
                                        </span>
                                    </div>

                                    {/* Info Block */}
                                    <div className="p-4 flex flex-col flex-1 justify-between">
                                        <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
                                            {product.category_name}
                                        </h3>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                                            <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">{product.category}</span>
                                            <span className="text-base font-bold text-slate-900">${product.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDE: CART SIDEBAR */}
            <div className="w-[420px] h-full bg-white border-l border-slate-200 shadow-xl flex flex-col z-10">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800">Current Order</h2>
                            <p className="text-xs text-slate-400">{cart.reduce((a, b) => a + b.quantity, 0)} items selected</p>
                        </div>
                    </div>
                    {cart.length > 0 && (
                        <button
                            onClick={() => setCart([])}
                            className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                <ShoppingBag className="w-8 h-8 text-slate-300 stroke-1" />
                            </div>
                            <p className="font-medium text-slate-600">Cart is empty</p>
                            <p className="text-xs mt-1 max-w-[200px]">Click on products from the catalog grid to add them to this invoice.</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 group">
                                <img src={item.image_url} alt={item.name} className="w-14 h-14 object-cover rounded-lg bg-white border border-slate-200" />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-2">{item.name}</h4>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition-colors md:opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                                        {/* Stepper controls */}
                                        <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-1 text-slate-500 hover:bg-slate-50 transition-colors"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="px-2.5 text-xs font-bold text-slate-700 min-w-[24px] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-1 text-slate-500 hover:bg-slate-50 transition-colors"
                                                disabled={item.quantity >= item.stock}
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Summary & Checkout Footer */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
                    <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-medium text-slate-800">${cartTotals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax (5%)</span>
                            <span className="font-medium text-slate-800">${cartTotals.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200/60">
                            <span>Total Payable</span>
                            <span className="text-indigo-600">${cartTotals.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        disabled={cart.length === 0}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99] transition-all text-center text-sm"
                    >
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
}
