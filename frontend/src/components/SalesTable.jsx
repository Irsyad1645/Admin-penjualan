import { useState } from 'react';

export function SalesTable({ sales, currency, showActions = false, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState('');
  const [draft, setDraft] = useState({ qty: 1, date: '' });

  const startEdit = sale => {
    setEditingId(sale.id);
    setDraft({ qty: sale.qty, date: sale.date });
  };

  const cancelEdit = () => {
    setEditingId('');
    setDraft({ qty: 1, date: '' });
  };

  const saveEdit = sale => {
    onUpdate?.(sale.id, { qty: draft.qty, date: draft.date });
    cancelEdit();
  };

  return (
    <div className="table-wrapper">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Produk</th>
            <th>Tanggal</th>
            <th>Jumlah</th>
            <th>Total</th>
            {showActions && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => {
            const total = Number(sale.qty || 0) * Number(sale.product_price || 0);
            const isEditing = editingId === sale.id;
            return (
              <tr key={sale.id}>
                <td>{sale.product_name || 'Produk dihapus'}</td>
                <td>
                  {isEditing ? (
                    <input
                      className="input input-bordered input-sm"
                      type="date"
                      value={draft.date}
                      onChange={e => setDraft(d => ({ ...d, date: e.target.value }))}
                    />
                  ) : (
                    sale.date
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      className="input input-bordered input-sm"
                      type="number"
                      min="1"
                      value={draft.qty}
                      onChange={e => setDraft(d => ({ ...d, qty: e.target.value }))}
                    />
                  ) : (
                    `${sale.qty} pcs`
                  )}
                </td>
                <td>{currency(total)}</td>
                {showActions && (
                  <td>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          className="btn btn-outline btn-xs border-primary text-primary"
                          onClick={() => saveEdit(sale)}
                        >
                          Simpan
                        </button>
                        <button className="btn btn-outline btn-xs btn-error" onClick={cancelEdit}>
                          Batal
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          className="btn btn-outline btn-xs border-primary text-primary"
                          onClick={() => startEdit(sale)}
                        >
                          Edit
                        </button>
                        <button className="btn btn-outline btn-xs btn-error" onClick={() => onDelete?.(sale.id)}>
                          Hapus
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
          {!sales.length && (
            <tr>
              <td colSpan={showActions ? 6 : 5}>Belum ada transaksi</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
