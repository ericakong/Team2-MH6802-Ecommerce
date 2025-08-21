import { USE_MOCK_API, API_BASE_URL } from '../config/constants';

// Simple role fixture for demo
const USERS = [
    { email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { email: 'user@example.com', password: 'user123', role: 'user', name: 'Regular User' },
];

async function mockLogin({ email, password }) {
    await new Promise(r => setTimeout(r, 500));
    const found = USERS.find(u => u.email === email && u.password === password);
    if (!found) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        throw err;
    }
    // Return minimal info + fake token
    return {
        user: { email: found.email, role: found.role, name: found.name },
        token: 'mock-jwt-token',
    };
}

async function realLogin({ email, password }) {
    // Example real call (adjust path/payload as needed)
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Avoid sending extra PII; only what's necessary
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Prefer httpOnly cookie on server (GDPR-friendly)
    });
    if (!res.ok) {
        const text = await res.text();
        const err = new Error(text || 'Login failed');
        err.status = res.status;
        throw err;
    }
    // Example response: { user: {email, role, name}, token?: '...' }
    return res.json();
}

export async function loginApi(payload) {
    return USE_MOCK_API ? mockLogin(payload) : realLogin(payload);
}