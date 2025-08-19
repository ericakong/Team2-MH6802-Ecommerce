import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ChatWidget from './components/ChatWidget'
import { PROJECT_TITLE } from './config/constants';
import ScrollToTop from './components/ScrollToTop'
import OrderHistory from './pages/OrderHistory';

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
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-history" element={<OrderHistory />} /> 
        </Routes>
      </main>
      <Footer />
      {/* Global chat (home/cart/checkout) */}
      <ChatWidget />
    </div>
  )
}