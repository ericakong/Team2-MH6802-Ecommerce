import React, { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const { cart, clearCart } = useContext(CartContext);
  const [status, setStatus] = useState({ loading: true, ok: false, email: '', total: 0 });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!sessionId) { setStatus({ loading: false, ok: false }); return; }
      try {
        const res = await fetch(`/api/retrieve-session?id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        const paid = data.payment_status === 'paid';
        if (mounted) {
          setStatus({
            loading: false,
            ok: paid,
            email: data.customer_email || '',
            total: (data.amount_total || 0) / 100,
          });
          if (paid && cart.length) clearCart();
        }
      } catch {
        if (mounted) setStatus({ loading: false, ok: false });
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (status.loading) {
    return <div className="mx-auto max-w-2xl p-10 text-center">Verifying payment…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-center">
      <div className="card p-8">
        {status.ok ? (
          <>
            <h1 className="text-3xl font-semibold">🎉 Payment successful!</h1>
            <p className="mt-2 text-gray-600">Receipt will be emailed{status.email ? ` to ${status.email}` : ''}.</p>
            <p className="mt-2 font-medium">Total paid: ${status.total.toFixed(2)}</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold">We couldn’t verify your payment</h1>
            <p className="mt-2 text-gray-600">Please contact support with your session id: <span className="font-mono">{sessionId}</span></p>
          </>
        )}
        <Link to="/" className="btn mt-6 inline-block">Back to Home</Link>
      </div>
    </div>
  );
}
