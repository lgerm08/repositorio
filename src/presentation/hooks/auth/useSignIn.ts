import { useMutation } from '@tanstack/react-query';
import { AuthRepositoryImpl } from '../../../data/repositories/AuthRepositoryImpl';
import { SignInUseCase } from '../../../domain/usecases/auth/SignInUseCase';
import { useAuthContext } from '../../context/AuthContext';

const authRepo = new AuthRepositoryImpl();
const signInUseCase = new SignInUseCase(authRepo);

export function useSignIn() {
  const { setAuth } = useAuthContext();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signInUseCase.execute(email, password),
    onSuccess: ({ token, user }) => setAuth(token, user),
  });
}
