import { useEffect, useState } from 'react';

export function useUiState() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState('dashboard'); // dashboard, tambah, kelola, akun

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(t);
  }, [message]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(''), 5000);
    return () => clearTimeout(t);
  }, [error]);

  return {
    message,
    error,
    view,
    setMessage,
    setError,
    setView,
  };
}
