import { Link } from 'react-router-dom'

function ProductCard({ product }) {
    return (
        <div className="card overflow-hidden group h-full flex flex-col">
            <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-square bg-white">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                        loading="lazy"
                    />
                </div>
            </Link>
            <div className="p-4 flex-1 flex flex-col">
                <Link to={`/product/${product.id}`} className="font-medium line-clamp-2">
                    {product.name}
                </Link>
                <div className="mt-2 text-brand font-semibold">${product.price.toFixed(2)}</div>
                <div className="mt-auto pt-3">
                    <Link to={`/product/${product.id}`} className="btn w-full">View</Link>
                </div>
            </div>
        </div>
    )
}

function SkeletonCard() {
    return (
        <div className="card overflow-hidden h-full">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="mt-3 h-9 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    )
}

export default function ProductGrid({ products = [], loading = false, ...rest }) {
    const skeletonCount = 6

    return (
        <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
                {loading && Array.from({ length: skeletonCount }).map((_, i) => (
                    <SkeletonCard key={`skeleton-${i}`} />
                ))}
            </div>

            {!loading && products.length === 0 && (
                <div className="mt-12 text-center text-gray-600">
                    No products found. Try changing filters or search.
                </div>
            )}
        </>
    )
}