import { useEffect, useRef, useState } from 'react'
import { fetchCategories, fetchProducts } from '../lib/api'
import ProductGrid from '../components/ProductGrid'
import Filters from '../components/Filters'
import SearchBar from '../components/SearchBar'
import data from '../data/products.json'

export default function Home() {
    const [categories, setCategories] = useState(['All'])
    const [category, setCategory] = useState('All')
    const [q, setQ] = useState('')
    const [page, setPage] = useState(1)
    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0)
    const pageSize = 6

    // used to ignore late responses (race-safe + StrictMode-safe)
    const reqRef = useRef(0)

    useEffect(() => {
        fetchCategories().then(setCategories)
    }, [])

    // reset when filters/search change
    useEffect(() => {
        setItems([])
        setPage(1)
    }, [q, category])

    // fetch products when query/category/page change
    useEffect(() => {
        let mounted = true
        const myReqId = ++reqRef.current

        fetchProducts({ q, category, page, pageSize }).then(({ items: newItems, total }) => {
            // ignore if:
            // 1) component unmounted
            // 2) a newer request has been started (React StrictMode or fast typing)
            if (!mounted || myReqId !== reqRef.current) return

            if (page === 1) {
                // first page replaces the list
                setItems(newItems)
            } else {
                // subsequent pages append
                setItems((prev) => [...prev, ...newItems])
            }
            setTotal(total)
        })

        return () => {
            mounted = false
        }
    }, [q, category, page])

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
                    canLoadMore={items.length < total}
                    onLoadMore={() => setPage((p) => p + 1)}
                />
            </div>
        </div>
    )
}