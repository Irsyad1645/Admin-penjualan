export function NavTabs({ view, setView }) {
  return (
    <nav className="nav">
      <button className={view === 'dashboard' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('dashboard')}>
        Menu Utama
      </button>
      <button className={view === 'tambah' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('tambah')}>
        Tambah Data
      </button>
      <button className={view === 'kelola' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('kelola')}>
        Kelola & Hapus
      </button>
    </nav>
  );
}
