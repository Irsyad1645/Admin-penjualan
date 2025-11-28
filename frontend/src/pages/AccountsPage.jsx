import { useState } from 'react';

function EyeIcon({ hidden = false }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
      />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      {hidden && <path strokeLinecap="round" strokeWidth="2" d="M4 4l16 16" />}
    </svg>
  );
}

export function AccountsPage({ users, handleDeleteUser, handleChangePassword, handleChangeName }) {
  const [visible, setVisible] = useState({});

  const onRename = email => {
    const val = prompt('Masukkan nama baru');
    if (val == null) return;
    handleChangeName(email, val);
  };

  const onChangePass = email => {
    const val = prompt('Masukkan password baru (min 4 karakter)');
    if (val == null) return;
    handleChangePassword(email, val);
  };

  return (
    <section className="grid gap-4 grid-cols-1">
      <div className="card">
        <div className="card-header">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Admin</p>
            <h3 className="text-lg font-bold text-slate-800">Kelola Akun</h3>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Password</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.email}>
                  <td>{user.name || '-'}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span>{visible[user.email] ? user.password : '••••••••'}</span>
                      <button
                        type="button"
                        className="btn btn-circle btn-ghost btn-xs border border-slate-200 text-slate-600"
                        title={visible[user.email] ? 'Sembunyikan' : 'Lihat'}
                        onClick={() =>
                          setVisible(v => ({
                            ...v,
                            [user.email]: !v[user.email],
                          }))
                        }
                      >
                        <EyeIcon hidden={!visible[user.email]} />
                      </button>
                      <button className="btn btn-outline btn-xs" onClick={() => onChangePass(user.email)}>
                        Ganti Password
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-xs" onClick={() => onRename(user.email)}>
                        Ganti Nama
                      </button>
                      <button className="btn btn-outline btn-xs btn-error" onClick={() => handleDeleteUser(user.email)}>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
