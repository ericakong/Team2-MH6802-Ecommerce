import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById, fetchProducts } from '../api/product';
import { getRecommendations } from '../api/recommendations';
import ChatWidget from '../components/ChatWidget';
import ProductGallery from '../components/ProductGallery';
import TikTokLiveCompact from '../components/TikTokLiveCompact';
import Reviews from '../components/Reviews';
import { CartContext } from '../context/CartContext';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/512?text=Product';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, updateQuantity, isCartDisabled } = useContext(CartContext);

  useEffect(() => {
    let alive = true;
    let poll = null;

    const isComplete = (p) =>
      p &&
      typeof p.name === 'string' &&
      p.name.trim().length > 0 &&
      typeof p.price === 'number';

    async function loadOnce() {
      const p = await fetchProductById(id); // tolerant to '1' or 'p-1'
      if (!alive) return false;

      if (p) {
        // Update product immediately (keeps UI refreshed on admin edits)
        setProduct(p);

        if (isComplete(p)) {
          setLoading(false);

          // Load fresh recommendations AFTER product is ready
          try {
            // support both sync and async implementations
            const all = await fetchProducts({ pageSize: 1000 });
            const picks = all.items
              .filter((x) => String(x.id) !== String(p.id))
              .slice(0, 4);

            // If you have a separate recommendations API, prefer that:
            // const picks = await Promise.resolve(getRecommendations(p.id, 4));
            setRecs(picks);
          } catch {
            // best-effort; ignore rec errors
          }

          return true; // stop polling
        }
      }

      // keep spinner until complete
      setLoading(true);
      return false;
    }

    // initial attempt
    setLoading(true);
    setProduct(null);
    setRecs([]);
    void loadOnce();

    // poll until complete (admin just added/edited)
    poll = setInterval(async () => {
      const done = await loadOnce();
      if (done && poll) {
        clearInterval(poll);
        poll = null;
      }
    }, 800);

    // also react to store changes across the app/tabs
    const onChange = () => void loadOnce();
    window.addEventListener('products-updated', onChange);
    window.addEventListener('storage', onChange);

    return () => {
      alive = false;
      if (poll) clearInterval(poll);
      window.removeEventListener('products-updated', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [id]);

  if (loading || !product) {
    return <div className="mx-auto max-w-7xl p-6">Loading…</div>;
  }

  const images =
    Array.isArray(product.images) && product.images.length
      ? product.images
      : [product.image || PLACEHOLDER_IMG];

  const onQtyChange = (e) => {
    const v = Number(e.target.value);
    const n = !Number.isFinite(v) || v < 1 ? 1 : Math.floor(v);
    setQty(n);
  };

  const ensureInCartWithQty = (desiredQty) => {
    const existing = cart.find((i) => i.id === product.id)?.quantity ?? 0;
    if (existing > 0) {
      updateQuantity(product.id, existing + desiredQty);
    } else {
      addToCart(product);
      if (desiredQty > 1) updateQuantity(product.id, desiredQty);
    }
  };

  const onAddToCart = () => {
    if (!isCartDisabled) ensureInCartWithQty(qty);
  };

  const onBuyNow = () => {
    if (isCartDisabled) return;
    ensureInCartWithQty(qty);
    navigate('/checkout');
  };

  const shipText = product.policies?.shipEstimate ?? 'Ships in 3–5 business days';
  const returnText =
    product.policies?.returnWindowDays != null
      ? `${product.policies.returnWindowDays}-day returns`
      : '30-day returns';
  const warrantyText =
    product.policies?.warrantyYears != null
      ? `${product.policies.warrantyYears}-year warranty`
      : '1-year warranty';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span>{product.name || 'Product'}</span>
      </nav>

      {/* Two columns */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <ProductGallery name={product.name || 'Product'} images={images} />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.name || 'Product'}</h1>
          <div className="text-sm text-gray-600 mt-1">{product.category || 'Uncategorized'}</div>
          <div className="mt-4 text-3xl font-semibold">
            ${Number(product.price || 0).toFixed(2)}
          </div>
          <p className="mt-4 text-gray-700">{product.description?.trim() || 'No description.'}</p>

          <div className="mt-6 card p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="qty" className="sr-only">Quantity</label>
              <input
                id="qty"
                type="number"
                min="1"
                value={qty}
                onChange={onQtyChange}
                onBlur={(e) => { if (!e.target.value) setQty(1); }}
                className="input w-24"
              />

              <button
                className={`btn ${isCartDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={onAddToCart}
                disabled={isCartDisabled}
                title={isCartDisabled ? 'Cart is disabled for admin users' : 'Add to Cart'}
              >
                Add to Cart
              </button>

              <button
                className={`btn btn-primary ${isCartDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={onBuyNow}
                disabled={isCartDisabled}
                title={isCartDisabled ? 'Cart is disabled for admin users' : 'Buy now'}
              >
                Buy Now
              </button>
            </div>

            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ {shipText}</li>
              <li>✅ {returnText}</li>
              <li>✅ {warrantyText}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-10 border-t" />

      {/* Reviews */}
      <Reviews productId={product.id} />

      {/* Live + recommendations */}
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <TikTokLiveCompact />
        <section className="card p-3">
          <h3 className="font-semibold mb-2">You may also like</h3>
          <div className="space-y-2">
            {recs.map((r) => (
              <Link
                key={r.id}
                to={`/product/${r.id}`}
                className="flex items-center gap-3 rounded-md border p-2 hover:bg-gray-50"
              >
                <img
                  src={r.image || PLACEHOLDER_IMG}
                  alt={r.name}
                  className="w-14 h-14 object-cover rounded"
                />
                <div className="min-w-0">
                  <div className="font-medium truncate">{r.name}</div>
                  <div className="text-sm text-gray-600">${Number(r.price || 0).toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <ChatWidget productId={product.id} />
    </div>
  );
}
