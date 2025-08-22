import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './styles/index.css'
import App from './App'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY
if (!STRIPE_KEY) throw new Error('Missing VITE_STRIPE_PUBLIC_KEY')
const stripePromise = loadStripe(STRIPE_KEY)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Elements stripe={stripePromise}>
            <App />
          </Elements>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
