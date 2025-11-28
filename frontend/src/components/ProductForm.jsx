export function ProductForm({ productForm, setProductForm, onSubmit, onReset }) {
  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit} onReset={onReset}>
      <input type="hidden" value={productForm.id} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="form-control w-full">
          <span className="label-text">Nama Produk</span>
          <input
            className="input input-bordered w-full"
            required
            placeholder="Contoh: Kopi Tubruk"
            value={productForm.name}
            onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
          />
        </label>
        <label className="form-control w-full">
          <span className="label-text">Kategori</span>
          <input
            className="input input-bordered w-full"
            placeholder="Contoh: Minuman"
            value={productForm.category}
            onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}
          />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="form-control w-full">
          <span className="label-text">Harga (Rp)</span>
          <input
            className="input input-bordered w-full"
            type="number"
            min="0"
            required
            value={productForm.price}
            onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
          />
        </label>
        <label className="form-control w-full">
          <span className="label-text">Stok</span>
          <input
            className="input input-bordered w-full"
            type="number"
            min="0"
            required
            value={productForm.stock}
            onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))}
          />
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button type="reset" className="btn btn-ghost">
          Bersihkan
        </button>
        <button type="submit" className="btn btn-primary">
          {productForm.id ? 'Update Produk' : 'Simpan Produk'}
        </button>
      </div>
    </form>
  );
}
