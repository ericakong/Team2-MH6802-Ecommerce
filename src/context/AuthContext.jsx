import { createContext, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: false,
  setLoading: () => {},
  saveAuth: () => {},
  clearAuth: () => {},
  isAuthenticated: false,
  isAdmin: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { email, role, name }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load persisted auth once
  useEffect(() => {
    try {
      const saved = localStorage.getItem('auth');
      if (saved) {
        const { user: u, token: t } = JSON.parse(saved);
        setUser(u || null);
        setToken(t || null);
      }
    } catch {/* ignore */}
  }, []);

  // React to external changes (other components/tabs)
  useEffect(() => {
    const onStorage = (e) => {
      if (e && e.key && e.key !== 'auth') return;
      try {
        const saved = localStorage.getItem('auth');
        if (saved) {
          const { user: u, token: t } = JSON.parse(saved);
          setUser(u || null);
          setToken(t || null);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch {/* ignore */}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const broadcast = () => {
    try {
      // Fire a storage-like event so listeners update immediately (same-tab fallback)
      window.dispatchEvent(new StorageEvent('storage', { key: 'auth' }));
    } catch {
      window.dispatchEvent(new Event('storage'));
    }
  };

  const saveAuth = (u, t) => {
    setUser(u || null);
    setToken(t || null);
    localStorage.setItem('auth', JSON.stringify({ user: u || null, token: t || null }));
    broadcast();
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
    broadcast();
  };

  const value = useMemo(() => ({
    user,
    token,
    loading,
    setLoading,
    saveAuth,
    clearAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
