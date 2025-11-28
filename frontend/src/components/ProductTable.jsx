import { useState } from 'react';

export function ProductTable({ products, currency, showActions = false, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState('');
  const [draft, setDraft] = useState({ name: '', category: '', price: 0, stock: 0 });

  const startEdit = product => {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
  };

  const cancelEdit = () => {
    setEditingId('');
    setDraft({ name: '', category: '', price: 0, stock: 0 });
  };

  const saveEdit = async product => {
    await onUpdate?.({ ...product, ...draft });
    cancelEdit();
  };

  const renderValue = (product, field, type = 'text') => {
    if (editingId !== product.id) {
      return field === 'price'
        ? currency(product.price)
        : field === 'stock'
        ? `${product.stock} pcs`
        : field === 'category'
        ? product.category || 'Umum'
        : product.name;
    }
    return (
      <input
        className="input input-bordered input-sm"
        type={type}
        value={draft[field]}
        onChange={e => setDraft(d => ({ ...d, [field]: type === 'number' ? e.target.value : e.target.value }))}
      />
    );
  };

  return (
    <div className="table-wrapper">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stok</th>
            {showActions && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const low = Number(product.stock) <= 5;
            const isEditing = editingId === product.id;
            return (
              <tr key={product.id}>
                <td>{renderValue(product, 'name')}</td>
                <td>
                  {isEditing ? (
                    renderValue(product, 'category')
                  ) : (
                    <span className="pill">{product.category || 'Umum'}</span>
                  )}
                </td>
                <td>{renderValue(product, 'price')}</td>
                <td>
                  {isEditing ? (
                    renderValue(product, 'stock', 'number')
                  ) : (
                    <span className={`pill ${low ? 'low' : ''}`}>{product.stock} pcs</span>
                  )}
                </td>
                {showActions && (
                  <td>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            className="btn btn-outline btn-xs border-primary text-primary"
                            onClick={() => saveEdit(product)}
                          >
                            Simpan
                          </button>
                          <button className="btn btn-outline btn-xs btn-error" onClick={cancelEdit}>
                            Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-outline btn-xs border-primary text-primary"
                            onClick={() => startEdit(product)}
                          >
                            Edit
                          </button>
                          <button className="btn btn-outline btn-xs btn-error" onClick={() => onDelete?.(product.id)}>
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
          {!products.length && (
            <tr>
              <td colSpan={showActions ? 5 : 4}>Belum ada produk</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
