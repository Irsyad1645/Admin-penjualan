import { useState } from 'react';
import { Banner } from '../../components/Banner';

export function LoginPage({
  loginForm,
  setLoginForm,
  handleLogin,
  error,
  newUser,
  setNewUser,
  handleAddUser,
}) {
  const [mode, setMode] = useState('login'); // login | register
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegisterPass, setShowRegisterPass] = useState(false);

  const Eye = ({ hidden = false }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-slate-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      {hidden && <path strokeLinecap="round" strokeWidth="2" d="M4 4l16 16" />}
    </svg>
  );

  return (
    <div className="min-h-screen bg-base-100 text-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white text-slate-900 rounded-2xl shadow-xl border border-base-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-1 text-primary">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-slate-600">
              {mode === 'login'
                ? 'Enter your credentials to sign in'
                : 'Enter your details to create your account'}
            </p>
          </div>
        </div>

        {error && <Banner type="error">⚠️ {error}</Banner>}

        {mode === 'login' ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-semibold text-slate-800 block mb-2">Email</label>
              <input
                className="input input-bordered w-full"
                type="email"
                placeholder="m@example.com"
                value={loginForm.email}
                onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800 block mb-2">Password</label>
              <div className="relative">
                <input
                  className="input input-bordered w-full pr-14"
                  type={showLoginPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-600 hover:text-primary transition"
                  onClick={() => setShowLoginPass(v => !v)}
                  aria-label="Toggle password"
                >
                  <Eye hidden={!showLoginPass} />
                </button>
              </div>
            </div>
            <button className="btn btn-primary w-full" type="submit">
              Sign in
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleAddUser}>
            <div>
              <label className="text-sm font-semibold text-slate-800 block mb-2">Name</label>
              <input
                className="input input-bordered w-full"
                placeholder="Your name"
                value={newUser.name}
                onChange={e => setNewUser(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800 block mb-2">Email</label>
              <input
                className="input input-bordered w-full"
                type="email"
                placeholder="m@example.com"
                value={newUser.email}
                onChange={e => setNewUser(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800 block mb-2">Password</label>
              <div className="relative">
                <input
                  className="input input-bordered w-full pr-14"
                  type={showRegisterPass ? 'text' : 'password'}
                  placeholder="Minimal 4 karakter"
                  value={newUser.password}
                  onChange={e => setNewUser(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-600 hover:text-primary transition"
                  onClick={() => setShowRegisterPass(v => !v)}
                  aria-label="Toggle password"
                >
                  <Eye hidden={!showRegisterPass} />
                </button>
              </div>
            </div>
            <button className="btn btn-primary w-full" type="submit">
              Create account
            </button>
          </form>
        )}

        <div className="mt-6 text-sm text-center text-slate-600">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button className="font-semibold text-primary" onClick={() => setMode('register')}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button className="font-semibold text-primary" onClick={() => setMode('login')}>
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
