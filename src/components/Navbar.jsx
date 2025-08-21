// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";

/** Toggle this to show/hide the Order History link without editing JSX >> SHOW_ORDER_HISTORY = true to show*/
const SHOW_ORDER_HISTORY = false;

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated, clearAuth } = useContext(AuthContext);
  const { itemCount } = useContext(CartContext);
  const [open, setOpen] = useState(false);

  const greeting = isAuthenticated
    ? (isAdmin ? "Hi Admin" : (user?.name ? `Hi, ${user.name}` : "Hi regular user"))
    : null;

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  // Shared link styles
  const navChip =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors bg-white/10 hover:bg-white/20 inline-flex items-center";
  const linkBase = "px-3 py-2 rounded-md text-sm font-medium";
  const link = ({ isActive }) =>
    `${linkBase} ${isActive ? "bg-white/10 text-white" : "text-gray-200 hover:text-white hover:bg-white/5"}`;

  return (
    <nav className="sticky top-0 z-10 bg-brand text-white" role="navigation" aria-label="Global">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* LEFT: Logo + Admin/Cart + (hidden) Order History */}
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
              <img
                src={logo}
                alt="Team 2 E-commerce Shop"
                className="w-6 h-6 select-none"
                draggable="false"
              />
              <span className="font-semibold tracking-tight truncate">Team 2 E-commerce Shop</span>
            </Link>

            {isAdmin ? (
              <NavLink to="/admin/products" className={navChip} onClick={() => setOpen(false)}>
                Admin
              </NavLink>
            ) : (
              <Link to="/cart" className={`${navChip} relative`} aria-label="Cart" onClick={() => setOpen(false)}>
                Cart
                <span
                  aria-live="polite"
                  className="ml-2 inline-flex items-center justify-center min-w-[1.5rem] h-6 rounded-full bg-red-500 text-white text-xs px-1"
                >
                  {itemCount}
                </span>
              </Link>
            )}

            {/* Order History: present but hidden until you flip the flag above */}
            {SHOW_ORDER_HISTORY && (
              <NavLink to="/order-history" className={link} onClick={() => setOpen(false)}>
                Order History
              </NavLink>
            )}
          </div>

          {/* RIGHT: Greeting + Auth (desktop) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {greeting && (
              <span className="text-sm text-white/90 truncate max-w-[40vw] sm:max-w-none">
                {greeting}
              </span>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              className="p-2 rounded-md focus-visible:ring-2 focus-visible:ring-white"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              <div className="space-y-1">
                <span className="block w-6 h-0.5 bg-white" />
                <span className="block w-6 h-0.5 bg-white" />
                <span className="block w-6 h-0.5 bg-white" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <NavLink to="/" onClick={() => setOpen(false)} className={link}>
              Products
            </NavLink>

            {/* Order History hidden via flag */}
            {SHOW_ORDER_HISTORY && (
              <NavLink to="/order-history" onClick={() => setOpen(false)} className={link}>
                Order History
              </NavLink>
            )}

            {!isAdmin && (
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className={`${linkBase} text-gray-200 hover:text-white hover:bg-white/5`}
              >
                Cart
                <span
                  aria-live="polite"
                  className="ml-2 inline-flex items-center justify-center min-w-[1.5rem] h-6 rounded-full bg-brand text-white text-xs px-1"
                >
                  {itemCount}
                </span>
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className={`${linkBase} bg-red-600 hover:bg-red-700 text-white w-full text-left`}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className={`${linkBase} bg-green-600 hover:bg-green-700 text-white`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
