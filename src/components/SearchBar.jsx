// src/components/SearchBar.jsx
import { useEffect, useState } from 'react'

export default function SearchBar({ value, setValue, dataset }) {
    const [local, setLocal] = useState(value)

    // keep local field in sync if parent changes externally
    useEffect(() => setLocal(value), [value])

    useEffect(() => {
        const t = setTimeout(() => setValue(local.trim()), 300) // debounce 300ms
        return () => clearTimeout(t)
    }, [local, setValue])

    return (
        <input
            type="search"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Search products..."
            className="input"
            aria-label="Search products"
        />
    )
}