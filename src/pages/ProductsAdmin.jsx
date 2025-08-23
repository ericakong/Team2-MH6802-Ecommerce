import React, { useEffect, useMemo, useState } from 'react';
import {
  fetchProducts,
  adminAddProduct,
  adminUpdateProduct,
  adminRemoveProduct,
} from '../api/product';

export default function ProductsAdmin() {
  const [q, setQ] = useState('');
  const [category] = useState('All');
  const [page, setPage] = useState(1);
  const [res, setRes] = useState({ items: [], total: 0, page: 1, pageSize: 6 });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const pages = Math.max(1, Math.ceil(res.total / res.pageSize));

  // Inline edit state (name/price/image per id)
  const [edits, setEdits] = useState({}); // { [id]: { name, price, image } }

  // Add product form
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    description: '',
  });

  // helper: rebuild the edit map from a list of items
  const seedEdits = (items) => {
    const next = {};
    items.forEach((p) => {
      next[p.id] = {
        name: p.name ?? '',
        price: p.price ?? 0,
        image: p.image ?? '',
      };
    });
    setEdits(next);
  };

  // Load list
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchProducts({ q, category, page, pageSize: 6 })
      .then((data) => {
        if (!alive) return;
        setRes(data);
        seedEdits(data.items);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, [q, category, page]);

  const canSave = useMemo(() => !saving && !loading, [saving, loading]);

  async function handleSave(id) {
    if (!canSave) return;
    const patch = edits[id];
    if (!patch) return;
    setSaving(true);
    try {
      await adminUpdateProduct(id, {
        name: (patch.name || '').trim(),
        price: Number(patch.price) || 0,
        image: (patch.image || '').trim(), // ✅ now we save image too
      });
      const data = await fetchProducts({ q, category, page, pageSize: 6 });
      setRes(data);
      seedEdits(data.items);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id) {
    if (!canSave) return;
    if (!window.confirm('Remove this product?')) return;
    setSaving(true);
    try {
      await adminRemoveProduct(id);
      const nextTotal = res.total - 1;
      const nextPages = Math.max(1, Math.ceil(nextTotal / res.pageSize));
      const nextPage = Math.min(page, nextPages);
      const data = await fetchProducts({ q, category, page: nextPage, pageSize: 6 });
      setPage(nextPage);
      setRes(data);
      seedEdits(data.items);
    } finally {
      setSaving(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newItem.name || !newItem.price) {
      alert('Name and price are required.');
      return;
    }
    setSaving(true);
    try {
      await adminAddProduct({
        name: newItem.name.trim(),
        price: Number(newItem.price) || 0,
        image: newItem.image.trim(),
        category: newItem.category.trim() || 'Uncategorized',
        description: newItem.description.trim(),
      });
      setShowAdd(false);
      setNewItem({ name: '', price: '', image: '', category: '', description: '' });
      const data = await fetchProducts({ q, category, page: 1, pageSize: 6 });
      setPage(1);
      setRes(data);
      seedEdits(data.items);
    } finally {
      setSaving(false);
    }
  }

  // tiny helper to force the browser to re-fetch when the URL changes
  const bust = (url) => {
    if (!url) return '';
    return `${url}${url.includes('?') ? '&' : '?'}v=img1`;
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Products Management</h1>

      {/* Top controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Search products…"
          className="border rounded px-3 py-2 w-full md:w-80"
        />
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="ml-auto bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          {showAdd ? 'Close' : 'Add product'}
        </button>
      </div>

      {/* Add product form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white shadow rounded-xl p-4 mb-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Name *</label>
              <input
                className="border rounded px-3 py-2 w-full"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Price *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="border rounded px-3 py-2 w-full"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Image URL</label>
              <input
                className="border rounded px-3 py-2 w-full"
                value={newItem.image}
                onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Category</label>
              <input
                className="border rounded px-3 py-2 w-full"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                placeholder="e.g. Accessories"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              className="border rounded px-3 py-2 w-full h-24"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="border px-4 py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          <ul className="space-y-3">
            {res.items.map((p) => {
              const edit = edits[p.id] || {};
              const imgSrc = bust(edit.image ?? p.image);
              return (
                <li key={p.id} className="bg-white shadow rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <img
                      key={imgSrc}
                      src={imgSrc}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div className="flex-1 grid md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600">Name</label>
                        <input
                          className="border rounded px-3 py-2 w-full"
                          value={edit.name ?? p.name ?? ''}
                          onChange={(e) =>
                            setEdits((prev) => ({
                              ...prev,
                              [p.id]: { ...(prev[p.id] || {}), name: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600">Price</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="border rounded px-3 py-2 w-full"
                          value={edit.price ?? p.price ?? 0}
                          onChange={(e) =>
                            setEdits((prev) => ({
                              ...prev,
                              [p.id]: { ...(prev[p.id] || {}), price: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs text-gray-600">Image URL</label>
                        <input
                          className="border rounded px-3 py-2 w-full"
                          placeholder="https://..."
                          value={edit.image ?? p.image ?? ''}
                          onChange={(e) =>
                            setEdits((prev) => ({
                              ...prev,
                              [p.id]: { ...(prev[p.id] || {}), image: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleSave(p.id)}
                        disabled={saving}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-60"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleRemove(p.id)}
                        disabled={saving}
                        className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-60"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Pagination */}
          <div className="flex items-center gap-2 mt-4">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              Prev
            </button>
            <span className="text-sm">Page {page} / {pages}</span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page >= pages || loading}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
