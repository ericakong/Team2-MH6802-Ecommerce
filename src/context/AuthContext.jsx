import { createContext, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  token: null,
  isAdmin: false,
  isAuthenticated: false,
  hydrating: true,          // 🔹 NEW
  setLoading: () => {},
  saveAuth: () => {},
  clearAuth: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    try {
      // use localStorage so it survives full redirects
      const raw = localStorage.getItem('auth');
      if (raw) {
        const { user: u, token: t } = JSON.parse(raw);
        setUser(u || null);
        setToken(t || null);
      }
    } finally {
      setHydrating(false);   // 🔹 tell guards we're ready
    }
  }, []);

  const saveAuth = (u, t) => {
    setUser(u);
    setToken(t || null);
    localStorage.setItem('auth', JSON.stringify({ user: u, token: t || null }));
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
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
    hydrating,          
  }), [user, token, loading, hydrating]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
