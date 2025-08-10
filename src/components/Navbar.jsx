import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import logo from '../assets/logo.svg' // <-- SVG file (no plugin required)

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const [count, setCount] = useState(0)

    useEffect(() => {
        const update = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]')
            setCount(cart.reduce((sum, i) => sum + i.qty, 0))
        }
        update()
        window.addEventListener('storage', update)
        window.addEventListener('cart-updated', update)
        return () => {
            window.removeEventListener('storage', update)
            window.removeEventListener('cart-updated', update)
        }
    }, [])

    const linkBase = 'px-3 py-2 rounded-md text-sm font-medium'
    const link = ({ isActive }) =>
        `${linkBase} ${isActive ? 'bg-white/10 text-white' : 'text-gray-200 hover:text-white hover:bg-white/5'}`

    return (
        <nav className="bg-brand text-white" role="navigation" aria-label="Global">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Logo + Primary links */}
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2">
                            {/* SVG logo as an image (scales crisply on all devices) */}
                            <img
                                src={logo}
                                alt="Team 2 E‑commerce Shop"
                                className="w-6 h-6 select-none"
                                draggable="false"
                            />
                            <span className="font-semibold tracking-tight">Team 2 E‑commerce Shop</span>
                        </Link>
                    </div>

                    {/* Right: Cart */}
                    <div className="hidden md:block">
                        <Link to="/cart" className="btn btn-outline relative" aria-label="Cart">
                            Cart
                            <span
                                aria-live="polite"
                                className="ml-2 inline-flex items-center justify-center min-w-[1.5rem] h-6 rounded-full bg-brand text-white text-xs px-1"
                            >
                                {count}
                            </span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
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
                <div className="md:hidden" id="mobile-menu">
                    <div className="space-y-1 px-2 pt-2 pb-3">
                        <NavLink to="/" onClick={() => setOpen(false)} className={link}>Products</NavLink>
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
                                {count}
                            </span>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}