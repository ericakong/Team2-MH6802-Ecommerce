import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
    return (
        <div className="card overflow-hidden">
            <Link to={`/product/${product.id}`} className="block">
                <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
            </Link>
            <div className="p-4">
                <Link to={`/product/${product.id}`} className="font-medium hover:underline">
                    {product.name}
                </Link>
                <div className="mt-2 text-lg font-semibold">${product.price.toFixed(2)}</div>
                <Link to={`/product/${product.id}`} className="btn w-full mt-3">View</Link>
            </div>
        </div>
    )
}