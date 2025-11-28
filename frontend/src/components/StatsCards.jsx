export function StatsCards({ stats, bestSeller, currency }) {
  const cards = [
    {
      title: 'Total Pendapatan',
      value: currency(stats?.totalRevenue),
      desc: bestSeller ? `Produk terlaris: ${bestSeller.name} (${bestSeller.qty} pcs)` : 'Produk terlaris: -',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Penjualan',
      value: stats ? `${stats.totalSales} transaksi` : '0 transaksi',
      desc: `Rata-rata: ${currency(stats?.avgTicket || 0)}`,
      color: 'from-sky-500 to-sky-600',
    },
    {
      title: 'Produk Tersedia',
      value: stats ? `${stats.totalProducts} item` : '0 item',
      desc: `Kategori: ${stats?.categoryCount || 0}`,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Stok Rendah',
      value: stats ? `${stats.lowStock} produk` : '0 produk',
      desc: 'Segera restock',
      color: 'from-amber-400 to-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(card => (
        <div
          key={card.title}
          className={`rounded-xl p-4 text-white shadow-lg bg-gradient-to-r ${card.color}`}
        >
          <p className="text-sm opacity-90">{card.title}</p>
          <p className="text-2xl font-bold mt-1">{card.value}</p>
          <p className="text-xs opacity-90 mt-1">{card.desc}</p>
        </div>
      ))}
    </div>
  );
}
