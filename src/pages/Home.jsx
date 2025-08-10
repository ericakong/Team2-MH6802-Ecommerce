import { useEffect, useRef, useState } from 'react'
import { fetchCategories, fetchProducts } from '../lib/api' // <-- original mock api
import ProductGrid from '../components/ProductGrid'
import Filters from '../components/Filters'
import SearchBar from '../components/SearchBar'
import data from '../data/products.json' // optional: for SearchBar suggestions

export default function Home() {
    const [categories, setCategories] = useState(['All'])
    const [category, setCategory] = useState('All')
    const [q, setQ] = useState('')
    const [page, setPage] = useState(1)
    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const pageSize = 6

    // Guards for StrictMode double-invoke + racing requests
    const reqRef = useRef(0)
    const didInit = useRef(false)

    // Infinite scroll sentinel
    const sentinelRef = useRef(null)

    useEffect(() => {
        fetchCategories().then(setCategories).catch(console.error)
    }, [])

    // Reset list when search/category changes
    useEffect(() => {
        setItems([])
        setPage(1)
    }, [q, category])

    // Fetch products
    useEffect(() => {
        // Tiny tweak so first StrictMode double-run doesn't feel like two loads
        if (!didInit.current) {
            didInit.current = true
        }

        let mounted = true
        const myReqId = ++reqRef.current
        setLoading(true)

        fetchProducts({ q, category, page, pageSize })
            .then(({ items: newItems, total }) => {
                if (!mounted || myReqId !== reqRef.current) return
                if (page === 1) setItems(newItems)            // replace on first page
                else setItems(prev => [...prev, ...newItems]) // append on next pages
                setTotal(total)
            })
            .catch(console.error)
            .finally(() => {
                if (mounted && myReqId === reqRef.current) setLoading(false)
            })

        return () => { mounted = false }
    }, [q, category, page])

    const canLoadMore = items.length < total

    // Infinite scroll via IntersectionObserver
    useEffect(() => {
        const el = sentinelRef.current
        if (!el) return
        const io = new IntersectionObserver(
            (entries) => {
                const isVisible = entries[0]?.isIntersecting
                if (isVisible && canLoadMore && !loading) {
                    setPage(p => p + 1)
                }
            },
            { rootMargin: '200px 0px' } // prefetch before hitting the bottom
        )
        io.observe(el)
        return () => io.disconnect()
    }, [canLoadMore, loading])

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h1 className="text-2xl font-bold">Products</h1>
                <div className="w-full sm:w-80">
                    <SearchBar value={q} setValue={setQ} dataset={data} />
                </div>
            </div>

            <div className="mt-4">
                <Filters categories={categories} category={category} setCategory={setCategory} />
            </div>

            <div className="mt-6">
                <ProductGrid
                    products={items}
                    loading={loading}     // show skeletons while loading
                    canLoadMore={false}   // infinite scroll takes over
                    onLoadMore={() => { }}
                />

                {/* Loading / end indicator */}
                <div className="mt-6 flex justify-center text-sm text-gray-600">
                    {loading ? <span>Loading…</span> : !canLoadMore && items.length > 0 ? <span>End of results</span> : null}
                </div>

                {/* Invisible sentinel to trigger next page */}
                <div ref={sentinelRef} className="h-1" />
            </div>
        </div>
    )
}