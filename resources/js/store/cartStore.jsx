/* Cart store with Zustand and localStorage persistence */

import { create } from 'zustand';

const cartStore = create((set, get) => ({
    cart: [],
    cartTotals: [],



    // Initialize from localStorage on mount
    initializeFromStorage: () => {
        const saved = localStorage.getItem('cartState');
        if (saved) {
            set({ cart: JSON.parse(saved) });
        }
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
                localStorage.setItem('cartState', JSON.stringify(newCart));
                return { cart: newCart };
            }

            // New item
            const newCart = [...state.cart, { ...product, selectedQuantity: 1 }];
            localStorage.setItem('cartState', JSON.stringify(newCart));
            return { cart: newCart };
        });
    },

    // Remove item from cart
    removeItem: (id) => {
        set((state) => {
            const newCart = state.cart.filter(item => item.id !== id);
            localStorage.setItem('cartState', JSON.stringify(newCart));
            return { cart: newCart };
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
            localStorage.setItem('cartState', JSON.stringify(newCart));
            return { cart: newCart };
        });
    },

    // Clear cart
    clearCart: () => {
        localStorage.removeItem('cartState');
        set({ cart: [] });
    },

    // Get cart totals
    getTotal: () => {
        const state = get();
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.05;
        return {
            subtotal,
            tax,
            total: subtotal + tax
        };
    }
}));

export default cartStore;

