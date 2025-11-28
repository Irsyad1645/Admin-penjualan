const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const today = () => new Date().toISOString().slice(0, 10);

export async function fetchJson(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Terjadi kesalahan');
  }
  return res.json();
}
