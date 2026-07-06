/* Cart store with Zustand and localStorage persistence */

import { create } from 'zustand';

// Helper function to calculate totals from cart array
const getTotalsFromCart = (cart) => {
    const subtotal = cart.reduce(
        (sum, item) => sum + (item.price * item.selectedQuantity),
        0
    );
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    return { subtotal, tax, total };
};

const cartStore = create((set, get) => ({
    cart: [],
    subtotal: 0,
    tax: 0,
    total: 0,

    // Initialize from localStorage on mount
    initializeFromStorage: () => {
        const saved = localStorage.getItem('cartState');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Expecting { cart: [...], subtotal?, tax?, total? }
                const { cart, subtotal = 0, tax = 0, total = 0 } = parsed;
                set({ cart, subtotal, tax, total });
            } catch (e) {
                console.error('Failed to parse cartState from localStorage', e);
                set({ cart: [] });
            }
        }
    },

    // Recalculate totals from cart
    recalculateTotals: () => {
        const { cart } = get();
        const { subtotal, tax, total } = getTotalsFromCart(cart);
        set({ subtotal, tax, total });
    },

    // Add item to cart
    addItem: (product) => {
        set((state) => {
            const existing = state.cart.find(item => item.id === product.id);

            if (existing) {
                // Check stock (quantity) limit
                if (existing.selectedQuantity >= product.quantity) return state;
                // Increment quantity (selectedQuantity)
                const newCart = state.cart.map(item =>
                    item.id === product.id
                        ? { ...item, selectedQuantity: item.selectedQuantity + 1 }
                        : item
                );
                const { subtotal, tax, total } = getTotalsFromCart(newCart);
                // Persist updated cart + totals
                localStorage.setItem('cartState', JSON.stringify({
                    cart: newCart,
                    subtotal,
                    tax,
                    total
                }));
                return { cart: newCart, subtotal, tax, total };
            }

            // New item
            const newCart = [...state.cart, { ...product, selectedQuantity: 1 }];
            const { subtotal, tax, total } = getTotalsFromCart(newCart);
            localStorage.setItem('cartState', JSON.stringify({
                cart: newCart,
                subtotal,
                tax,
                total
            }));
            return { cart: newCart, subtotal, tax, total };
        });
    },

    // Remove item from cart
    removeItem: (id) => {
        set((state) => {
            const newCart = state.cart.filter(item => item.id !== id);
            const { subtotal, tax, total } = getTotalsFromCart(newCart);
            localStorage.setItem('cartState', JSON.stringify({
                cart: newCart,
                subtotal,
                tax,
                total
            }));
            return { cart: newCart, subtotal, tax, total };
        });
    },

    // Update item quantity
    updateItemQuantity: (id, quantity) => {
        set((state) => {
            const newCart = state.cart.map(item =>
                item.id === id
                    ? { ...item, selectedQuantity: item.selectedQuantity + quantity }
                    : item
            );
            // Negative quantity check
            if (newCart.find(item => item.id === id).selectedQuantity <= 0) return state;
            // Stock check
            if (newCart.find(item => item.id === id).selectedQuantity > newCart.find(item => item.id === id).quantity) return state;
            const { subtotal, tax, total } = getTotalsFromCart(newCart);
            localStorage.setItem('cartState', JSON.stringify({
                cart: newCart,
                subtotal,
                tax,
                total
            }));
            return { cart: newCart, subtotal, tax, total };
        });
    },

    // Clear cart
    clearCart: () => {
        localStorage.removeItem('cartState');
        set({ cart: [], subtotal: 0, tax: 0, total: 0 });
    },

    // Get cart totals (from state)
    getTotal: () => {
        const state = get();
        return {
            subtotal: state.subtotal,
            tax: state.tax,
            total: state.total
        };
    }
}));

export default cartStore;

