import { ProductTable } from '../components/ProductTable';
import { SalesTable } from '../components/SalesTable';

export function ManagePage({
  products,
  sales,
  currency,
  filters,
  setFilters,
  onUpdateProduct,
  onDeleteProduct,
  onDeleteSale,
  onUpdateSale,
}) {
  return (
    <section className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <div className="card bg-white shadow-lg border border-slate-200">
        <div className="card-header">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-600 font-bold">Kelola</p>
            <h3 className="text-xl font-bold text-slate-700">Produk</h3>
          </div>
          <input
            value={filters.product}
            onChange={e => setFilters(f => ({ ...f, product: e.target.value }))}
            className="input input-bordered"
            type="search"
            placeholder="Cari produk..."
          />
        </div>
        <ProductTable
          products={products}
          currency={currency}
          showActions
          onUpdate={onUpdateProduct}
          onDelete={onDeleteProduct}
        />
      </div>

      <div className="card bg-white shadow-lg border border-slate-200">
        <div className="card-header">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-600 font-bold">Kelola</p>
            <h3 className="text-xl font-bold text-slate-700">Penjualan</h3>
          </div>
          <input
            value={filters.sale}
            onChange={e => setFilters(f => ({ ...f, sale: e.target.value }))}
            className="input input-bordered"
            type="search"
            placeholder="Cari transaksi..."
          />
        </div>

        <SalesTable
          sales={sales}
          currency={currency}
          showActions
          onDelete={onDeleteSale}
          onUpdate={onUpdateSale}
        />
      </div>
    </section>
  );
}
