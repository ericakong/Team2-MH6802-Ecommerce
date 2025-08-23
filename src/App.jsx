import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ChatWidget from './components/ChatWidget'
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import ProductsAdmin from './pages/ProductsAdmin';
import { PROJECT_TITLE } from './config/constants';
import CheckoutSuccess from './pages/CheckoutSuccess.jsx';
import Compliance from './pages/Compliance.jsx';
// import OrderHistory from './pages/OrderHistory';

export default function App() {
  useEffect(() => {
    document.title = PROJECT_TITLE;
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ScrollToTop />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected (example: require login for checkout) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/compliance" element={<Compliance />} />
          {/* <Route path="/order-history" element={<OrderHistory />} /> */} 
          </Route>
          
          {/* Admin-only */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminRoute />}>
              <Route path="/admin/products" element={<ProductsAdmin />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
      {/* Global chat (home/cart/checkout) */}
      <ChatWidget />
    </div>
  )
}