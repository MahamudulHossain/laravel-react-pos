# Plan: Persist Cart State with Zustand

## Context
The POS system currently stores cart data in local component state, which is lost on page refresh. This plan adds Zustand with localStorage persistence to maintain cart data across sessions.

## Implementation Steps

### 1. Explore Current Cart Implementation
- Locate cart state management in `resources/js/Pages/Pos.jsx`
- Identify existing patterns for state management
- Confirm no existing global store

### 2. Create Zustand Cart Store
**File**: `resources/js/store/cartStore.js`
- Create store with `create` from zustand
- Add `persist` middleware for localStorage persistence
- Define `CartItem` shape (id, name, price, quantity, imageUrl)
- Implement actions:
  - `addItem`: Add item or increment existing item quantity
  - `removeItem`: Remove item by product ID
  - `clearCart`: Empty cart
  - `getTotal`: Calculate cart subtotal

### 3. Update UI Components
**Files to modify**:
- `resources/js/Pages/Pos.jsx`: Replace local cart state with `useCartStore`
- Add cart sidebar or modal: Read from `useCartStore(state => state.items)`
- Add remove/clear buttons: Call `useCartStore.getState().removeItem()` and `clearCart()`

### 4. Testing
- Verify cart persists across page refresh
- Validate add/remove/clear operations work correctly
- Test with multiple products and quantities

### 5. Documentation
- Add JSDoc comments to store actions
- Update README if necessary

## Key Files to Modify
- `resources/js/store/cartStore.js` (new)
- `resources/js/Pages/Pos.jsx`
- Any cart display components

## Verification
- Run `npm run dev`
- Add items to cart
- Refresh page
- Confirm cart still contains items
- Test checkout flow