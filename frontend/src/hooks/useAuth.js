import { useEffect, useState } from 'react';

const authKey = 'ujian_pweb_auth';

export function useAuth({ setError, setMessage, onLogout }) {
  const usersKey = 'ujian_pweb_users';
  const [auth, setAuth] = useState(() => localStorage.getItem(authKey) === '1');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '' });
  const [users, setUsers] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(usersKey) || '[]');
      return stored;
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(usersKey, JSON.stringify(users));
  }, [users]);

  function handleLogin(e) {
    e.preventDefault();
    const email = loginForm.email.trim().toLowerCase();
    const password = loginForm.password;
    const found = users.find(u => u.email.toLowerCase() === email && u.password === password);
    if (!found) {
      setError('Akun tidak ditemukan, silakan daftar');
      setMessage('');
      return;
    }
    localStorage.setItem(authKey, '1');
    setAuth(true);
    setCurrentUser(found);
    setMessage(`Login sebagai ${found.name || found.email}`);
    setError('');
  }

  function handleLogout() {
    localStorage.removeItem(authKey);
    setAuth(false);
    setCurrentUser(null);
    setMessage('Logout berhasil');
    setError('');
    onLogout?.();
  }

  function handleAddUser(e) {
    e.preventDefault();
    const email = newUser.email.trim().toLowerCase();
    const password = newUser.password.trim();
    const name = newUser.name.trim() || email;
    if (!email || !email.includes('@')) {
      setError('Email tidak valid');
      return;
    }
    if (password.length < 4) {
      setError('Password minimal 4 karakter');
      return;
    }
    if (users.some(u => u.email.toLowerCase() === email)) {
      setError('Email sudah terdaftar');
      return;
    }
    const updated = [...users, { email, password, name }];
    setUsers(updated);
    setNewUser({ email: '', password: '', name: '' });
    setMessage('Akun berhasil dibuat');
    setError('');
  }

  function handleDeleteUser(email) {
    if (users.length <= 1) {
      setError('Tidak bisa menghapus akun terakhir');
      return;
    }
    if (!confirm('Hapus akun ini?')) return;
    const updated = users.filter(u => u.email !== email);
    setUsers(updated);
    setMessage('Akun dihapus');
  }

  function handleChangePassword(email, newPassword) {
    const pass = (newPassword || '').trim();
    if (pass.length < 4) {
      setError('Password minimal 4 karakter');
      return;
    }
    const updated = users.map(u => (u.email === email ? { ...u, password: pass } : u));
    setUsers(updated);
    setMessage('Password diperbarui');
    setError('');
  }

  function handleChangeName(email, newName) {
    const name = (newName || '').trim();
    if (!name) {
      setError('Nama tidak boleh kosong');
      return;
    }
    const updated = users.map(u => (u.email === email ? { ...u, name } : u));
    setUsers(updated);
    setMessage('Nama akun diperbarui');
    setError('');
  }

  return {
    auth,
    loginForm,
    setLoginForm,
    currentUser,
    newUser,
    setNewUser,
    users,
    handleLogin,
    handleLogout,
    handleAddUser,
    handleDeleteUser,
    handleChangePassword,
    handleChangeName,
    DEFAULT_USER_EMAIL: users[0]?.email || '',
  };
}
