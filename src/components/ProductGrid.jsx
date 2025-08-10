import ProductCard from './ProductCard'

export default function ProductGrid({ products, onLoadMore, canLoadMore }) {
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
            {canLoadMore && (
                <div className="flex justify-center mt-6">
                    <button className="btn btn-outline" onClick={onLoadMore} aria-label="Load more products">
                        Load more
                    </button>
                </div>
            )}
        </>
    )
}