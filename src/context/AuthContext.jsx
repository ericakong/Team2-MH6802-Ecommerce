import { createContext, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  clearAuth: () => {},
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);  // {email, role, name}
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    // Persist token minimally (demo). For GDPR/production: prefer httpOnly cookies (server-managed).
    useEffect(() => {
        const saved = sessionStorage.getItem('auth');
        if (saved) {
            try {
                const { user: u, token: t } = JSON.parse(saved);
                setUser(u || null);
                setToken(t || null);
            } catch { /* ignore */ }
        }
    }, []);

    const saveAuth = (u, t) => {
        setUser(u);
        setToken(t || null);
        // Keep only what you absolutely need
        sessionStorage.setItem('auth', JSON.stringify({ user: u, token: t || null }));
    };

    const clearAuth = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('auth');
    };

    const value = useMemo(() => ({
        user, token, loading, setLoading, saveAuth, clearAuth,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    }), [user, token, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}