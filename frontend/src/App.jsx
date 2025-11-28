import './index.css';
import { Banner } from './components/Banner';
import { Topbar } from './components/Topbar';
import { useAdminApp } from './hooks/useAdminApp';
import { AccountsPage } from './pages/AccountsPage';
import { AddPage } from './pages/AddPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/login/LoginPage';
import { ManagePage } from './pages/ManagePage';

export default function App() {
  const store = useAdminApp();

  if (!store.auth) {
    return (
      <LoginPage
        loginForm={store.loginForm}
        setLoginForm={store.setLoginForm}
        handleLogin={store.handleLogin}
        error={store.error}
        newUser={store.newUser}
        setNewUser={store.setNewUser}
        handleAddUser={store.handleAddUser}
        demoEmail={store.DEFAULT_USER_EMAIL}
        demoPass="admin123"
      />
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Topbar
        view={store.view}
        setView={store.setView}
        currentUserEmail={store.currentUser?.email || store.DEFAULT_USER_EMAIL}
        onLogout={store.handleLogout}
        onAccount={() => store.setView('akun')}
      />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 pb-10 pt-4 space-y-3">
          {store.loading && <Banner type="muted">Memuat data...</Banner>}
          {store.error && !store.loading && <Banner type="error">⚠️ {store.error}</Banner>}
          {store.message && !store.error && <Banner type="success">{store.message}</Banner>}

          {store.view === 'dashboard' && (
            <DashboardPage
              stats={store.stats}
              bestSeller={store.bestSeller}
              currency={store.currency}
              filters={store.filters}
              setFilters={store.setFilters}
              products={store.filteredProducts}
              sales={store.filteredSales}
            />
          )}

          {store.view === 'tambah' && (
            <AddPage
              productForm={store.productForm}
              setProductForm={store.setProductForm}
              saleForm={store.saleForm}
              setSaleForm={store.setSaleForm}
              products={store.products}
              handleProductSubmit={store.handleProductSubmit}
              handleSaleSubmit={store.handleSaleSubmit}
              resetProductForm={store.resetProductForm}
              resetSaleForm={store.resetSaleForm}
            />
          )}

          {store.view === 'kelola' && (
            <ManagePage
              products={store.filteredProducts}
              sales={store.filteredSales}
              currency={store.currency}
              filters={store.filters}
              setFilters={store.setFilters}
              onUpdateProduct={store.handleUpdateProduct}
              onDeleteProduct={store.handleDeleteProduct}
              onDeleteSale={store.handleDeleteSale}
              onUpdateSale={store.handleUpdateSale}
            />
          )}

          {store.view === 'akun' && (
            <AccountsPage
              users={store.users}
              handleChangePassword={store.handleChangePassword}
              handleChangeName={store.handleChangeName}
              handleDeleteUser={store.handleDeleteUser}
            />
          )}
        </div>
      </main>

      <footer className="mt-auto w-full py-4 text-center text-slate-500 flex justify-center">
        <p>UJIAN PWEB · Dashboard Admin Penjualan (React + SQLite)</p>
      </footer>
    </div>
  );
}
