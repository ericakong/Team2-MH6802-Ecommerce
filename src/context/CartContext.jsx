// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext(null);

const BASE_KEY = 'cart_v1';
const keyFor = (email) => (email ? `${BASE_KEY}:${btoa(email)}` : `${BASE_KEY}:guest`);

const clampQty = (qty) => {
  const n = Number(qty);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
};

const sanitizeLine = (i) => ({
  id: i.id,
  name: i.name,
  price: Number(i.price) || 0,
  quantity: clampQty(i.quantity ?? 1),
  image: i.image || '',
});

const readCart = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map(sanitizeLine) : [];
  } catch {
    return [];
  }
};

const writeCart = (key, cart) => {
  try {
    const lean = cart.map(({ id, name, price, quantity, image }) => ({
      id, name, price, quantity, image
    }));
    localStorage.setItem(key, JSON.stringify(lean));
  } catch { /* ignore */ }
};

// ✅ remove ALL buckets that belong to our cart namespace
const removeAllCartBuckets = () => {
  try {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (k && k.startsWith(BASE_KEY + ':')) toRemove.push(k);
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  } catch { /* ignore */ }
};

export function CartProvider({ children }) {
  const { user, isAdmin } = useContext(AuthContext) ?? {};
  const storageKey = keyFor(user?.email || null);

  const [cart, setCart] = useState(() => readCart(storageKey));

  // When user bucket changes (guest <-> user), load from that bucket
  useEffect(() => {
    setCart(readCart(storageKey));
  }, [storageKey]);

  // Admins: keep cart empty and purge storage
  const isCartDisabled = !!isAdmin;
  useEffect(() => {
    if (isCartDisabled) {
      setCart([]);
      removeAllCartBuckets(); // ✅ ensure no bucket survives for admins
    }
  }, [isCartDisabled]);

  // Persist current bucket (non-admins)
  useEffect(() => {
    if (!isCartDisabled) writeCart(storageKey, cart);
  }, [cart, storageKey, isCartDisabled]);

  // ===== Actions
  const addToCart = (product) => {
    if (isCartDisabled || !product) return;
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: clampQty(p.quantity + 1) } : p
        );
      }
      const { id, name, price, image } = product;
      return [...prev, { id, name, price, image, quantity: 1 }];
    });
  };

  const updateQuantity = (id, qty) => {
    if (isCartDisabled) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: clampQty(qty) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    if (isCartDisabled) return;
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Clear state + wipe ALL buckets so switching users won’t revive old carts
  const clearCart = () => {
    if (isCartDisabled) return;
    setCart([]);
    removeAllCartBuckets();
  };

  // Derived values
  const itemCount = cart.reduce((sum, i) => sum + clampQty(i.quantity), 0);
  const total = cart.reduce((sum, i) => sum + i.price * clampQty(i.quantity), 0);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      total,
      itemCount,
      isCartDisabled,
    }),
    [cart, total, itemCount, isCartDisabled]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
