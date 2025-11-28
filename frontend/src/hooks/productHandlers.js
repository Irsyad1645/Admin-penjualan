import { fetchJson } from './useInventoryApi';

export function createProductHandlers({
  productForm,
  setProductForm,
  setMessage,
  setError,
  loadProducts,
  loadStats,
  resetProductForm,
}) {
  const validateProduct = payload => {
    if (!payload.name) throw new Error('Nama produk wajib diisi');
    if (Number.isNaN(payload.price) || Number.isNaN(payload.stock)) throw new Error('Harga/Stok tidak valid');
    if (payload.price < 0 || payload.stock < 0) throw new Error('Harga/Stok tidak boleh negatif');
    if (payload.price % 500 !== 0) throw new Error('Harga harus kelipatan 500');
  };

  const handleProductSubmit = async event => {
    event.preventDefault();
    try {
      const payload = {
        name: productForm.name.trim(),
        category: productForm.category.trim() || 'Umum',
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      };
      validateProduct(payload);
      if (productForm.id) {
        await fetchJson(`/products/${productForm.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        setMessage('Produk diperbarui');
      } else {
        await fetchJson('/products', { method: 'POST', body: JSON.stringify(payload) });
        setMessage('Produk ditambahkan');
      }
      resetProductForm();
      await Promise.all([loadProducts(), loadStats()]);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProduct = async product => {
    try {
      const payload = {
        name: product.name.trim(),
        category: (product.category || '').trim() || 'Umum',
        price: Number(product.price),
        stock: Number(product.stock),
      };
      validateProduct(payload);
      await fetchJson(`/products/${product.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      setMessage('Produk diperbarui');
      await Promise.all([loadProducts(), loadStats()]);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async id => {
    if (!confirm('Hapus produk ini? Transaksi terkait juga akan dihapus.')) return;
    try {
      await fetchJson(`/products/${id}`, { method: 'DELETE' });
      setMessage('Produk dihapus');
      await Promise.all([loadProducts(), loadStats()]);
    } catch (err) {
      setError(err.message);
    }
  };

  return { handleProductSubmit, handleUpdateProduct, handleDeleteProduct };
}
