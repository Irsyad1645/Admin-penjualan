import { fetchJson, today } from './useInventoryApi';

export function createSalesHandlers({
  saleForm,
  setSaleForm,
  setMessage,
  setError,
  loadProducts,
  loadSales,
  loadStats,
  resetSaleForm,
  sales,
}) {
  const handleSaleSubmit = async event => {
    event.preventDefault();
    try {
      const payload = {
        productId: saleForm.productId,
        qty: Number(saleForm.qty),
        date: saleForm.date || today(),
      };
      if (!payload.productId) throw new Error('Pilih produk');
      if (!payload.qty || payload.qty <= 0 || Number.isNaN(payload.qty)) throw new Error('Jumlah tidak valid');
      await fetchJson('/sales', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('Transaksi ditambahkan');
      resetSaleForm();
      await Promise.all([loadProducts(), loadSales(), loadStats()]);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSale = async id => {
    if (!confirm('Hapus transaksi ini?')) return;
    try {
      await fetchJson(`/sales/${id}`, { method: 'DELETE' });
      setMessage('Transaksi dihapus');
      await Promise.all([loadProducts(), loadSales(), loadStats()]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateSale = async (id, { qty, date }) => {
    const sale = sales.find(s => s.id === id);
    if (!sale) {
      setError('Transaksi tidak ditemukan');
      return;
    }
    const parsedQty = Number(qty);
    if (!parsedQty || parsedQty <= 0 || Number.isNaN(parsedQty)) {
      setError('Jumlah tidak valid');
      return;
    }
    const newDate = date || sale.date;
    try {
      await fetchJson(`/sales/${id}`, { method: 'DELETE' });
      await fetchJson('/sales', {
        method: 'POST',
        body: JSON.stringify({ productId: sale.product_id, qty: parsedQty, date: newDate }),
      });
      setMessage('Transaksi diperbarui');
      await Promise.all([loadProducts(), loadSales(), loadStats()]);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return { handleSaleSubmit, handleDeleteSale, handleUpdateSale };
}
