import { useAuthContext } from '../../context/AuthContext';

export function useSession() {
  const { user, token, isLoading, isAuthenticated } = useAuthContext();
  return { user, token, isLoading, isAuthenticated };
}
