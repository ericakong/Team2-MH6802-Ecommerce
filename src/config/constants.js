export const PROJECT_TITLE = 'Team 2 E-commerce Shop';
export const PROJECT_TAGLINE = 'Demo build for university presentation';
// Central place to read env vars and build the base URL for API calls
export const USE_MOCK_API = (import.meta.env.VITE_USE_MOCK_API ?? 'false') === 'true';

// If VITE_API_URL is provided, use it. Otherwise use a relative base ('').
export const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
