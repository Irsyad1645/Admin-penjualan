import { useAuth } from './useAuth';
import { useInventory } from './useInventory';
import { useUiState } from './useUiState';

export function useAdminApp() {
  const ui = useUiState();

  const inventory = useInventory({ setError: ui.setError, setMessage: ui.setMessage });
  const auth = useAuth({
    setError: ui.setError,
    setMessage: ui.setMessage,
    onLogout: () => {
      inventory.resetState();
      ui.setView('dashboard');
    },
  });

  return {
    ...ui,
    ...auth,
    ...inventory,
  };
}
