export function Topbar({ view, setView, currentUserEmail, onLogout, onAccount }) {
  const tabs = [
    { id: 'dashboard', label: 'Menu Utama' },
    { id: 'tambah', label: 'Tambah Data' },
    { id: 'kelola', label: 'Kelola Data' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-3 grid grid-cols-3 items-center">
      <div className="flex items-center gap-2 font-bold text-lg text-primary">
        <div className="badge badge-primary badge-sm"></div>
        ADMIN TOKO KELONTONG
      </div>

      <nav className="flex justify-center gap-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={
              view === tab.id
                ? 'btn btn-sm btn-primary text-white'
                : 'btn btn-sm btn-ghost text-slate-600'
            }
            onClick={() => setView(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2 justify-end">
        <span className="text-sm font-bold text-slate-600">{currentUserEmail}</span>
        <button className="btn btn-outline btn-sm" onClick={onAccount}>
          Kelola Akun
        </button>
        <button className="btn btn-primary btn-sm" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
