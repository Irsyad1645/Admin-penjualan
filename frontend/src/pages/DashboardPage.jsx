import { StatsCards } from '../components/StatsCards';
import { ProductTable } from '../components/ProductTable';
import { SalesTable } from '../components/SalesTable';

export function DashboardPage({ stats, bestSeller, currency, filters, setFilters, products, sales }) {
  return (
    <div className="space-y-4">
      <StatsCards stats={stats} bestSeller={bestSeller} currency={currency} />
      <section className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <div className="card bg-white shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Master Data</p>
              <h3 className="text-lg font-bold text-slate-800">Produk</h3>
            </div>
            <input
              value={filters.product}
              onChange={e => setFilters(f => ({ ...f, product: e.target.value }))}
              className="input input-bordered"
              type="search"
              placeholder="Cari produk..."
            />
          </div>
          <ProductTable products={products} currency={currency} />
        </div>

        <div className="card bg-white shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Operasional</p>
              <h3 className="text-lg font-bold text-slate-800">Penjualan</h3>
            </div>
            <input
              value={filters.sale}
              onChange={e => setFilters(f => ({ ...f, sale: e.target.value }))}
              className="input input-bordered"
              type="search"
              placeholder="Cari transaksi..."
            />
          </div>
          <SalesTable sales={sales} currency={currency} />
        </div>
      </section>
    </div>
  );
}
