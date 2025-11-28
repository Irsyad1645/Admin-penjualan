export function SaleForm({ saleForm, setSaleForm, products, onSubmit, onReset }) {
  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit} onReset={onReset}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="form-control w-full">
          <span className="label-text">Produk</span>
          <select
            className="select select-bordered w-full"
            required
            value={saleForm.productId}
            onChange={e => setSaleForm(f => ({ ...f, productId: e.target.value }))}
          >
            <option value="">Pilih produk</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.stock} stok)
              </option>
            ))}
          </select>
        </label>
        <label className="form-control w-full">
          <span className="label-text">Jumlah</span>
          <input
            className="input input-bordered"
            type="number"
            min="1"
            value={saleForm.qty}
            onChange={e => setSaleForm(f => ({ ...f, qty: e.target.value }))}
            required
          />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="form-control w-full">
          <span className="label-text">Tanggal</span>
          <input
            className="input input-bordered"
            type="date"
            value={saleForm.date}
            onChange={e => setSaleForm(f => ({ ...f, date: e.target.value }))}
            required
          />
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button type="reset" className="btn btn-ghost">
          Reset
        </button>
        <button type="submit" className="btn btn-primary">
          Tambah Penjualan
        </button>
      </div>
    </form>
  );
}
