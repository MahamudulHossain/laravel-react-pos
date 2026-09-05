import React, { useEffect } from 'react';
import { Search, ShoppingBag, Trash2, Plus, Minus, Layers } from 'lucide-react';
import { router, Head } from '@inertiajs/react';
import useDebounce from '@/Hooks/useDebounce';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import cartStore from '@/store/cartStore';

export default function Pos({ categories, products, queryParams = null }) {
    queryParams = queryParams || {};
    const debouncedSearch = useDebounce(queryParams.search || "", 500);
    const [search, setSearch] = useState(queryParams.search || "");

    // Get cart state and actions from store
    const { cart, addItem, updateItemQuantity, removeItem, clearCart, getTotal, initializeFromStorage } = cartStore();

    // Initialize cart from localStorage on mount
    useEffect(() => {
        initializeFromStorage();
    }, []);

    // 1. Category Action
    const handleCategoryChange = (category) => {
        const newParams = { ...queryParams, category };
        router.get(route('pos.index'), newParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Search Action

    useEffect(() => {
        router.get(
            route("pos.index"),
            {
                ...queryParams,
                search: debouncedSearch,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }, [debouncedSearch]);

    // 2. Cart Actions
    const addToCart = (product) => {
        addItem(product);
    };

    const updateQuantity = (id, delta) => {
        updateItemQuantity(id, delta);
    };

    const removeFromCart = (id) => {
        removeItem(id);
    };

    // 3. Calculations
    const cartTotals = getTotal();


    // 4. Render checkout page
    const handleCheckout = (cartTotals, cart) => {
        router.get(route('pos.checkout'), {
            cart: JSON.stringify(cart),
            cartTotals: JSON.stringify(cartTotals)
        }, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    return (

        <AuthenticatedLayout>

            <Head title="Product" />

            <div className="py-4">
                <div className="mx-auto max-w-9xl sm:px-4 lg:px-6">
                    <div className="flex h-[calc(100vh-6.5rem)] w-full overflow-hidden bg-ink-50 font-sans text-ink-800 antialiased">

                        {/* LEFT SIDE: PRODUCT SECTION */}
                        <div className="flex h-full flex-1 flex-col overflow-hidden p-4">
                            {/* Top Filter Bar */}
                            <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-card sm:flex-row">
                                {/* Category Dropdown */}
                                <div className="relative min-w-[200px] flex-shrink-0">
                                    <Layers className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                                    <select
                                        // value={selectedCategory}
                                        defaultValue={queryParams.category || 'All Categories'}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="w-full cursor-pointer appearance-none rounded-xl border border-ink-200 bg-ink-50 py-2.5 pl-10 pr-4 text-sm font-medium transition-all focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600"
                                    >
                                        <option value="all_categories">All Categories</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Search Input */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                                    <input
                                        type="text"
                                        placeholder="Type product name..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-xl border border-ink-200 bg-ink-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600"
                                    />
                                </div>
                            </div>

                            {/* Product Grid Area */}
                            <div className="flex-1 overflow-y-auto pb-4 pr-1">
                                {products.length === 0 ? (
                                    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white text-ink-400">
                                        <ShoppingBag className="mb-2 h-12 w-12 stroke-1" />
                                        <p className="text-sm font-medium">No active products found matching criteria.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                        {products.data.map((product) => (

                                            <div
                                                key={product.id}
                                                onClick={() => addToCart(product)}
                                                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-all duration-200 hover:border-brand-100 hover:shadow-lift"
                                            >
                                                {/* Image Container */}
                                                <div className="relative aspect-square w-full overflow-hidden bg-ink-100">
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <span className="absolute right-2 top-2 rounded-full bg-ink-900/80 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                                                        Stock: {product.quantity}
                                                    </span>
                                                </div>

                                                {/* Info Block */}
                                                <div className="flex flex-1 flex-col justify-between p-4">
                                                    <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-ink-800 transition-colors group-hover:text-brand-700">
                                                        {product.name}
                                                    </h3>
                                                    <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-ink-800 transition-colors group-hover:text-brand-700">
                                                        {product.category_name}
                                                    </h3>
                                                    <div className="mt-2 flex items-center justify-between border-t border-ink-50 pt-2">
                                                        <span className="text-xs font-medium uppercase tracking-wide text-ink-400">{product.category}</span>
                                                        <span className="text-base font-bold tabular-nums text-ink-900">${product.price.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT SIDE: CART SIDEBAR */}
                        <div className="z-10 flex h-full w-[420px] flex-col border-l border-ink-200 bg-white shadow-lift">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/50 p-5">
                                <div className="flex items-center gap-2.5">
                                    <div className="rounded-xl bg-brand-50 p-2 text-brand-700">
                                        <ShoppingBag className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-display font-bold text-ink-800">Current Order</h2>
                                        <p className="text-xs text-ink-400">{cart.reduce((a, b) => a + b.selectedQuantity, 0)} items selected</p>
                                    </div>
                                </div>
                                {cart.length > 0 && (
                                    <button
                                        onClick={() => clearCart()}
                                        className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Cart Items List */}
                            <div className="flex-1 space-y-3 overflow-y-auto p-4">
                                {cart.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center p-6 text-center text-ink-400">
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ink-50">
                                            <ShoppingBag className="h-8 w-8 stroke-1 text-ink-300" />
                                        </div>
                                        <p className="font-medium text-ink-600">Cart is empty</p>
                                        <p className="mt-1 max-w-[200px] text-xs">Click on products from the catalog grid to add them to this invoice.</p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="group flex gap-3 rounded-xl border border-ink-100 bg-ink-50 p-3">
                                            <img src={item.image_url} alt={item.name} className="h-14 w-14 rounded-lg border border-ink-200 bg-white object-cover" />
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="line-clamp-2 text-xs font-semibold text-ink-800">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="cursor-pointer rounded p-0.5 text-ink-400 transition-colors hover:text-rose-500 md:opacity-0 md:group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                                <div className="mt-1 flex items-center justify-between">
                                                    <span className="text-xs font-bold tabular-nums text-ink-900">${(item.price * item.selectedQuantity).toFixed(2)}</span>
                                                    {/* Stepper controls */}
                                                    <div className="flex items-center overflow-hidden rounded-lg border border-ink-200 bg-white shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="cursor-pointer p-1 text-ink-500 transition-colors hover:bg-ink-50"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="min-w-[24px] px-2.5 text-center text-xs font-bold tabular-nums text-ink-700">
                                                            {item.selectedQuantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="cursor-pointer p-1 text-ink-500 transition-colors hover:bg-ink-50"
                                                        // disabled={item.quantity >= item.qunatitySelected}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Summary & Checkout Footer */}
                            <div className="space-y-4 border-t border-ink-100 bg-ink-50/50 p-5">
                                <div className="space-y-2 text-sm text-ink-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-medium tabular-nums text-ink-800">${cartTotals.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax (5%)</span>
                                        <span className="font-medium tabular-nums text-ink-800">${cartTotals.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-ink-200/60 pt-2 text-base font-bold text-ink-900">
                                        <span>Total Payable</span>
                                        <span className="tabular-nums text-brand-700">${cartTotals.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    disabled={cart.length === 0}
                                    className="w-full rounded-xl bg-brand-600 px-4 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-brand-600/10 transition-all hover:bg-brand-700 hover:shadow-brand-600/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-ink-200"
                                    onClick={() => handleCheckout(cartTotals, cart)}
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
