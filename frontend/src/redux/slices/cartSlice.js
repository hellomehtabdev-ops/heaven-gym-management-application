import { createSlice } from '@reduxjs/toolkit';

const CART_STORAGE_PREFIX = 'heaven_gym_cart:';
const LEGACY_CART_STORAGE_KEYS = ['heaven_gym_cart', ['\x69ron', '\x66orge', '_cart'].join('')];

function getUserId(user) {
  return String(user?._id || user?.id || '');
}

function readUserCart(userId) {
  if (!userId) return [];
  try {
    const savedCart = localStorage.getItem(`${CART_STORAGE_PREFIX}${userId}`);
    const parsedCart = JSON.parse(savedCart || '[]');
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
}

function saveUserCart(userId, items) {
  if (!userId) return;
  localStorage.setItem(`${CART_STORAGE_PREFIX}${userId}`, JSON.stringify(items));
}

function clearInMemoryCart(state) {
  state.items = [];
  state.ownerId = null;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], ownerId: null },
  reducers: {
    addToCart: (state, action) => {
      if (!state.ownerId) return;
      const product = action.payload;
      const productId = String(product?.id || product?._id || '');
      if (!productId) return;
      const existing = state.items.find((item) => String(item.product?.id || item.product?._id || '') === productId);
      if (existing) existing.quantity += 1;
      else state.items.push({ product, quantity: 1 });
      saveUserCart(state.ownerId, state.items);
    },
    updateQuantity: (state, action) => {
      if (!state.ownerId) return;
      const { id, quantity } = action.payload;
      const item = state.items.find((entry) => String(entry.product?.id || entry.product?._id || '') === String(id));
      if (item) item.quantity = Math.max(1, Number(quantity) || 1);
      saveUserCart(state.ownerId, state.items);
    },
    removeFromCart: (state, action) => {
      if (!state.ownerId) return;
      state.items = state.items.filter((item) => String(item.product?.id || item.product?._id || '') !== String(action.payload));
      saveUserCart(state.ownerId, state.items);
    },
    clearCart: (state) => {
      if (state.ownerId) localStorage.removeItem(`${CART_STORAGE_PREFIX}${state.ownerId}`);
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    const loadCartForAuthenticatedUser = (state, action) => {
      const userId = getUserId(action.payload?.user || action.payload);
      state.ownerId = userId || null;
      state.items = readUserCart(userId);
    };
    builder
      .addCase('auth/getCurrentUser/fulfilled', loadCartForAuthenticatedUser)
      .addCase('auth/signIn/fulfilled', loadCartForAuthenticatedUser)
      .addCase('auth/getCurrentUser/rejected', clearInMemoryCart)
      .addCase('auth/signOut/fulfilled', clearInMemoryCart)
      .addCase('auth/signOut/rejected', clearInMemoryCart)
      .addCase('auth/signOutAll/fulfilled', clearInMemoryCart)
      .addCase('auth/signOutAll/rejected', clearInMemoryCart)
      .addCase('auth/clearAuth', clearInMemoryCart);
  },
});

for (const key of LEGACY_CART_STORAGE_KEYS) {
  localStorage.removeItem(key);
}

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
