export const PROJECT_TITLE = 'Team 2 E-commerce Shop';
export const PROJECT_TAGLINE = 'Demo build for university presentation';
// src/config/constants.js
export const USE_MOCK_API =
  String(import.meta.env.VITE_USE_MOCK_API ?? 'false').trim().toLowerCase() === 'true';

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL ?? '/api').replace(/\/+$/, '');

export const USE_MOCK_PAYMENTS = import.meta.env.VITE_USE_MOCK_PAYMENTS === 'true';

