const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 4000;

const dbFile = path.join(__dirname, 'data.db');
const db = new Database(dbFile);

app.use(cors());
app.use(express.json());

function seedSampleData() {
  const insertProduct = db.prepare(`
      INSERT INTO products (id, name, category, price, stock) VALUES (@id, @name, @category, @price, @stock)
    `);
  const insertSale = db.prepare(`
      INSERT INTO sales (id, product_id, qty, date, note) VALUES (@id, @product_id, @qty, @date, @note)
    `);
  const products = [
    { id: crypto.randomUUID(), name: 'Kopi Tubruk', category: 'Minuman', price: 18000, stock: 30 },
    { id: crypto.randomUUID(), name: 'Es Teh', category: 'Minuman', price: 8000, stock: 40 },
    { id: crypto.randomUUID(), name: 'Nasi Goreng', category: 'Makanan', price: 25000, stock: 20 },
  ];
  const today = new Date().toISOString().slice(0, 10);
  const tx = db.transaction(() => {
    products.forEach(p => insertProduct.run(p));
    insertSale.run({ id: crypto.randomUUID(), product_id: products[0].id, qty: 3, date: today, note: 'Meja 2' });
    insertSale.run({ id: crypto.randomUUID(), product_id: products[2].id, qty: 2, date: today, note: 'Pesanan online' });
    db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(3, products[0].id);
    db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(2, products[2].id);
  });
  tx();
}

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT DEFAULT 'Umum',
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      qty INTEGER NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as total FROM products').get().total;
  if (count === 0) {
    seedSampleData();
    console.log('Seeded initial data');
  }
}

function getStats() {
  const totalRevenue = db.prepare(`
    SELECT COALESCE(SUM(s.qty * p.price), 0) as revenue
    FROM sales s JOIN products p ON s.product_id = p.id
  `).get().revenue;

  const totalSales = db.prepare('SELECT COUNT(*) as total FROM sales').get().total;
  const avgTicket = totalSales ? Math.round(totalRevenue / totalSales) : 0;
  const totalProducts = db.prepare('SELECT COUNT(*) as total FROM products').get().total;
  const categoryCount = db.prepare('SELECT COUNT(DISTINCT category) as total FROM products').get().total;
  const lowStock = db.prepare('SELECT COUNT(*) as total FROM products WHERE stock <= 5').get().total;

  const bestSeller = db.prepare(`
    SELECT s.product_id as id, p.name, SUM(s.qty) as qty, SUM(s.qty * p.price) as revenue
    FROM sales s JOIN products p ON s.product_id = p.id
    GROUP BY s.product_id
    ORDER BY revenue DESC
    LIMIT 1
  `).get();

  return {
    totalRevenue,
    totalSales,
    avgTicket,
    totalProducts,
    categoryCount,
    lowStock,
    bestSeller: bestSeller || null,
  };
}

app.get('/api/products', (_req, res) => {
  const list = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.json(list);
});

app.post('/api/products', (req, res) => {
  const { name, category = 'Umum', price, stock } = req.body;
  if (!name || price == null || stock == null) return res.status(400).json({ message: 'Data produk tidak lengkap' });
  const product = { id: crypto.randomUUID(), name, category, price: Number(price), stock: Number(stock) };
  db.prepare('INSERT INTO products (id, name, category, price, stock) VALUES (@id, @name, @category, @price, @stock)').run(product);
  res.status(201).json(product);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, category = 'Umum', price, stock } = req.body;
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Produk tidak ditemukan' });
  db.prepare(`
    UPDATE products SET name = @name, category = @category, price = @price, stock = @stock WHERE id = @id
  `).run({ id, name, category, price: Number(price), stock: Number(stock) });
  res.json({ id, name, category, price: Number(price), stock: Number(stock) });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM sales WHERE product_id = ?').run(id);
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  if (!info.changes) return res.status(404).json({ message: 'Produk tidak ditemukan' });
  res.json({ message: 'Produk dihapus' });
});

app.get('/api/sales', (_req, res) => {
  const list = db.prepare(`
    SELECT s.*, p.name as product_name, p.price as product_price
    FROM sales s
    LEFT JOIN products p ON p.id = s.product_id
    ORDER BY s.date DESC, s.created_at DESC
  `).all();
  res.json(list);
});

app.post('/api/sales', (req, res) => {
  const { productId, qty, date, note } = req.body;
  if (!productId || !qty || !date) return res.status(400).json({ message: 'Data penjualan tidak lengkap' });
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
  if (Number(qty) > product.stock) return res.status(400).json({ message: 'Stok tidak cukup' });

  const sale = { id: crypto.randomUUID(), product_id: productId, qty: Number(qty), date, note: note || '' };
  const tx = db.transaction(() => {
    db.prepare('INSERT INTO sales (id, product_id, qty, date, note) VALUES (@id, @product_id, @qty, @date, @note)').run(sale);
    db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(sale.qty, productId);
  });
  tx();
  res.status(201).json(sale);
});

app.delete('/api/sales/:id', (req, res) => {
  const { id } = req.params;
  const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(id);
  if (!sale) return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM sales WHERE id = ?').run(id);
    db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(sale.qty, sale.product_id);
  });
  tx();
  res.json({ message: 'Transaksi dihapus' });
});

app.get('/api/stats', (_req, res) => {
  res.json(getStats());
});

app.get('/api/export', (_req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  const sales = db.prepare('SELECT * FROM sales ORDER BY date DESC, created_at DESC').all();
  res.json({
    products,
    sales,
    stats: getStats(),
    exportedAt: new Date().toISOString(),
  });
});

app.post('/api/reset', (_req, res) => {
  const tx = db.transaction(() => {
    db.exec('DELETE FROM sales; DELETE FROM products;');
    seedSampleData();
  });
  tx();
  res.json({ message: 'Data contoh dimuat ulang' });
});

app.post('/api/import', (req, res) => {
  const { products = [], sales = [] } = req.body || {};
  if (!Array.isArray(products) || !Array.isArray(sales)) {
    return res.status(400).json({ message: 'Format tidak valid: products/sales harus array' });
  }

  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, category, price, stock, created_at) VALUES (@id, @name, @category, @price, @stock, @created_at)
  `);
  const insertSale = db.prepare(`
    INSERT INTO sales (id, product_id, qty, date, note, created_at) VALUES (@id, @product_id, @qty, @date, @note, @created_at)
  `);

  try {
    const tx = db.transaction(() => {
      db.exec('DELETE FROM sales; DELETE FROM products;');
      products.forEach(p => {
        insertProduct.run({
          id: p.id || crypto.randomUUID(),
          name: p.name,
          category: p.category || 'Umum',
          price: Number(p.price || 0),
          stock: Number(p.stock || 0),
          created_at: p.created_at || new Date().toISOString(),
        });
      });
      sales.forEach(s => {
        // hanya terima jika product_id ada
        const exists = db.prepare('SELECT id FROM products WHERE id = ?').get(s.product_id);
        if (!exists) return;
        insertSale.run({
          id: s.id || crypto.randomUUID(),
          product_id: s.product_id,
          qty: Number(s.qty || 0),
          date: s.date || new Date().toISOString().slice(0, 10),
          note: s.note || '',
          created_at: s.created_at || new Date().toISOString(),
        });
      });
    });
    tx();
    res.json({ message: 'Data berhasil diimport' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal import data' });
  }
});

initDb();

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
