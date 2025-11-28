import { useEffect, useMemo, useState } from 'react';
import { fetchJson, today } from './useInventoryApi';
import { createProductHandlers } from './productHandlers';
import { createSalesHandlers } from './salesHandlers';

export function useInventory({ setError, setMessage }) {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState(null);
  const [productForm, setProductForm] = useState({ id: '', name: '', category: '', price: '', stock: '' });
  const [saleForm, setSaleForm] = useState({ productId: '', qty: 1, date: today() });
  const [filters, setFilters] = useState({ product: '', sale: '' });
  const [loading, setLoading] = useState(true);

  const currency = value =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
      Number(value || 0)
    );

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      await Promise.all([loadProducts(), loadSales(), loadStats()]);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    const data = await fetchJson('/products');
    setProducts(data);
  }

  async function loadSales() {
    const data = await fetchJson('/sales');
    setSales(data);
  }

  async function loadStats() {
    const data = await fetchJson('/stats');
    setStats(data);
  }

  function resetProductForm() {
    setProductForm({ id: '', name: '', category: '', price: '', stock: '' });
  }

  function resetSaleForm() {
    setSaleForm({ productId: '', qty: 1, date: today() });
  }

  function resetState() {
    setProducts([]);
    setSales([]);
    setStats(null);
    resetProductForm();
    resetSaleForm();
    setFilters({ product: '', sale: '' });
  }

  const productHandlers = createProductHandlers({
    productForm,
    setProductForm,
    setMessage,
    setError,
    loadProducts,
    loadStats,
    resetProductForm,
  });

  const salesHandlers = createSalesHandlers({
    saleForm,
    setSaleForm,
    setMessage,
    setError,
    loadProducts,
    loadSales,
    loadStats,
    resetSaleForm,
    sales,
  });

  const filteredProducts = useMemo(() => {
    const keyword = filters.product.toLowerCase();
    return products.filter(
      p => p.name.toLowerCase().includes(keyword) || (p.category || '').toLowerCase().includes(keyword)
    );
  }, [products, filters.product]);

  const filteredSales = useMemo(() => {
    const keyword = filters.sale.toLowerCase();
    return sales.filter(sale => {
      const name = (sale.product_name || '').toLowerCase();
      return name.includes(keyword) || (sale.date || '').includes(keyword);
    });
  }, [sales, filters.sale]);

  const bestSeller = stats?.bestSeller;

  return {
    products,
    sales,
    stats,
    productForm,
    saleForm,
    filters,
    loading,
    filteredProducts,
    filteredSales,
    bestSeller,
    currency,
    setProductForm,
    setSaleForm,
    setFilters,
    ...productHandlers,
    ...salesHandlers,
    handleResetData: async () => {
      if (!confirm('Reset ke data contoh?')) return;
      try {
        await fetchJson('/reset', { method: 'POST' });
        resetProductForm();
        resetSaleForm();
        await loadAll();
        setMessage('Data contoh dimuat');
      } catch (err) {
        setError(err.message);
      }
    },
    async handleExport() {
      const data = await fetchJson('/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'admin-penjualan-data.json';
      a.click();
      URL.revokeObjectURL(url);
    },
    async handleImportFile(file) {
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await fetchJson('/import', {
          method: 'POST',
          body: JSON.stringify({
            products: data.products || [],
            sales: data.sales || [],
          }),
        });
        await loadAll();
        setMessage('Import data berhasil');
        setError('');
      } catch (err) {
        setError(err.message || 'Gagal import data');
      }
    },
    loadAll,
    resetState,
  };
}
