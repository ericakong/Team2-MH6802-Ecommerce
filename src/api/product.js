// src/api/product.js
// Mock, writable products API with localStorage backing.
// Works with your existing fetchProducts usage.

import seedProducts from '../data/products.json';

const STORE_KEY = 'products_store_v1';

// Clear storage when browser closes (not just refresh)
// window.onbeforeunload fires on page unload
window.addEventListener('beforeunload', () => {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch {}
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function matchesId(productId, lookup) {
  const toNum = (v) => {
    const s = String(v);
    const m = s.match(/^p[-_]?(\d+)$/i);       // p-12 / p_12 → 12
    if (m) return Number(m[1]);
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  };
  const a = toNum(productId);
  const b = toNum(lookup);
  if (Number.isFinite(a) && Number.isFinite(b)) return a === b;
  // fallback to strict string compare
  return String(productId) === String(lookup);
}

function emitProductsUpdated() {
  try { window.dispatchEvent(new Event('products-updated')); } catch {}
}

function readStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // initialize from seed once
  localStorage.setItem(STORE_KEY, JSON.stringify(seedProducts));
  return [...seedProducts];
}

function writeStore(list) {
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
  emitProductsUpdated();
}

function nextId(list) {
  // incremental id, supports existing ids like 12 or "p-12"/"p_12"
  const maxId = list.reduce((m, p) => {
    const s = String(p.id);
    const m1 = s.match(/^p[-_]?(\d+)$/i);
    const n = m1 ? Number(m1[1]) : (typeof p.id === 'number' ? p.id : NaN);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return maxId + 1;
}

// ---------- Public API ----------

export async function fetchProducts({ q = '', category = 'All', page = 1, pageSize = 6 } = {}) {
  await delay(200 + Math.random() * 300);
  const products = readStore();

  const term = q.trim().toLowerCase();
  let list = products;

  if (category && category !== 'All') {
    list = list.filter((p) => (p.category || '') === category);
  }
  if (term) {
    list = list.filter((p) => (p.name || '').toLowerCase().includes(term));
  }

  const total = list.length;
  const start = (page - 1) * pageSize;
  const items = list.slice(start, start + pageSize);

  return { items, total, page, pageSize };
}

export async function fetchProductById(id) {
  await delay(120 + Math.random() * 180);
  const products = readStore();
  return products.find((p) => matchesId(p.id, id)) ?? null;
}

export async function fetchCategories() {
  await delay(80);
  const list = readStore();
  const cats = Array.from(new Set(list.map((p) => p.category).filter(Boolean))).sort();
  return ['All', ...cats];
}

// ----- Admin mutations (mock, persisted in localStorage) -----

export async function adminAddProduct({ name, price, image, category = 'Uncategorized', description = '' }) {
  await delay(150);
  const list = readStore();
  const id = nextId(list);
  const newItem = {
    id, // stays numeric; tolerant matching handles "p-<id>" routes too
    name: (name || '').trim(),
    price: Number(price) || 0,
    image: image || '',
    category,
    description,
  };
  writeStore([newItem, ...list]); // prepend new for quick visibility
  return newItem;
}

export async function adminUpdateProduct(id, patch) {
  await delay(120);
  const list = readStore();
  const idx = list.findIndex((p) => matchesId(p.id, id));
  if (idx === -1) return null;
  const updated = {
    ...list[idx],
    ...(patch.name != null ? { name: String(patch.name) } : {}),
    ...(patch.price != null ? { price: Number(patch.price) || 0 } : {}),
    ...(patch.image != null ? { image: String(patch.image) } : {}),
    ...(patch.category != null ? { category: String(patch.category) } : {}),
    ...(patch.description != null ? { description: String(patch.description) } : {}),
  };
  const next = [...list];
  next[idx] = updated;
  writeStore(next);
  return updated;
}

export async function adminRemoveProduct(id) {
  await delay(120);
  const list = readStore();
  const next = list.filter((p) => !matchesId(p.id, id));
  writeStore(next);
  return { ok: true };
}
