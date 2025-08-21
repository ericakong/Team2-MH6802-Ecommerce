import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginApi } from '../api/auth';
import { USE_MOCK_API } from '../config/constants';

export default function Login() {
    const { setLoading, saveAuth } = useContext(AuthContext);
    const [email, setEmail] = useState(USE_MOCK_API ? 'admin@example.com' : '');
    const [password, setPassword] = useState(USE_MOCK_API ? 'admin123' : '');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { user, token } = await loginApi({ email, password });
            saveAuth(user, token);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white shadow rounded-xl p-6 space-y-4">
                <h1 className="text-2xl font-bold">Login</h1>

                {/* Minimal, purpose-limited notice (GDPR-friendly UX) */}
                <p className="text-xs text-gray-500">
                    We only process your email and password for authentication. No analytics or tracking is used on this page.
                </p>

                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        className="mt-1 w-full border rounded px-3 py-2"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-label="Email"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        className="mt-1 w-full border rounded px-3 py-2"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-label="Password"
                    />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Sign in
                </button>

                <div className="text-xs text-gray-500">
                    Mode: <span className="font-mono">{USE_MOCK_API ? 'MOCK' : 'REAL'}</span>
                </div>
            </form>
        </div>
    );
}