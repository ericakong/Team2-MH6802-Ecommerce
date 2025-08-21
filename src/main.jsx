import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './styles/index.css'
import App from './App'

import { USE_MOCK_API, API_BASE_URL } from './config/constants';
console.info('[CFG]', { USE_MOCK_API, API_BASE_URL });
window.__APP_DIAG__ = { USE_MOCK_API, API_BASE_URL }; // check in DevTools

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)