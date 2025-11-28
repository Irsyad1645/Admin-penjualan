# Admin-penjualan (UJIAN_PWEB) - Dashboard Admin Penjualan (React + Express + SQLite)

Aplikasi admin penjualan dengan frontend React (Vite + Tailwind + DaisyUI) dan backend Express + SQLite (better-sqlite3). Backend otomatis membuat DB `server/data.db` dan mengisi data contoh; frontend menyimpan akun di `localStorage`.

## Apa yang bisa dilakukan
- CRUD produk, filter nama/kategori.
- Catat penjualan dengan validasi stok dan histori transaksi.
- Statistik ringkas: omzet, jumlah transaksi, rata-rata ticket, stok rendah, best seller.
- Ekspor/impor JSON dan reset ke data contoh.
- Kelola akun lokal (email/password) langsung di UI.

## Struktur
- `frontend/` - React + Vite. Env: `VITE_API_URL` (default `http://localhost:4000/api`).
- `server/` - Express + better-sqlite3. DB: `server/data.db` (dibuat dan di-seed otomatis).

## Prasyarat
- Node.js 18+ (perlu `crypto.randomUUID` dan `fetch` bawaan).
- NPM.

## Setup cepat
Backend:
```bash
cd server
npm install
npm start            # http://localhost:4000
```
Frontend (terminal lain):
```bash
cd frontend
npm install
# Opsional: set API jika backend bukan di localhost:4000
# echo VITE_API_URL=http://localhost:4000/api > .env
npm run dev          # default http://localhost:5173
```

## Auth dan akun
- Tidak ada akun default; buat akun baru di halaman login (email + password minimal 4 karakter).
- Data akun disimpan di `localStorage`; logout atau clear storage untuk reset akun.

## Skrip penting
- Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`.
- Backend: `npm start`.

## Endpoint backend (ringkas)
- `GET /api/products` - daftar produk.
- `POST /api/products` - tambah produk.
- `PUT /api/products/:id` - ubah produk.
- `DELETE /api/products/:id` - hapus produk (+hapus penjualan terkait).
- `GET /api/sales` - daftar penjualan (dengan info produk).
- `POST /api/sales` - tambah penjualan (kurangi stok).
- `DELETE /api/sales/:id` - hapus penjualan (kembalikan stok).
- `GET /api/stats` - statistik ringkas.
- `GET /api/export` - ekspor produk + penjualan + statistik.
- `POST /api/import` - impor data (produk dan penjualan).
- `POST /api/reset` - reset DB ke data contoh.

## Siap push ke GitHub
`git add . && git commit -m "Add frontend and backend app" && git push -u origin main`
