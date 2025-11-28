import { ProductForm } from '../components/ProductForm';
import { SaleForm } from '../components/SaleForm';

export function AddPage({
  productForm,
  setProductForm,
  saleForm,
  setSaleForm,
  products,
  handleProductSubmit,
  handleSaleSubmit,
  resetProductForm,
  resetSaleForm,
}) {
  return (
    <section className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <div className="card bg-white shadow-lg border border-slate-200">
        <div className="card-header">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Master Data</p>
            <h3 className="text-lg font-bold text-slate-700">Tambah / Edit Produk</h3>
          </div>
        </div>
        <ProductForm
          productForm={productForm}
          setProductForm={setProductForm}
          onSubmit={handleProductSubmit}
          onReset={resetProductForm}
        />
      </div>

      <div className="card bg-white shadow-lg border border-slate-200">
        <div className="card-header">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Operasional</p>
            <h3 className="text-lg font-bold text-slate-700">Tambah Penjualan</h3>
          </div>
        </div>
        <SaleForm
          saleForm={saleForm}
          setSaleForm={setSaleForm}
          products={products}
          onSubmit={handleSaleSubmit}
          onReset={resetSaleForm}
        />
      </div>
    </section>
  );
}
