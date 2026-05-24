import { useMutation } from '@tanstack/react-query';
import { AuthRepositoryImpl } from '../../../data/repositories/AuthRepositoryImpl';
import { SignUpUseCase } from '../../../domain/usecases/auth/SignUpUseCase';
import { useAuthContext } from '../../context/AuthContext';

const authRepo = new AuthRepositoryImpl();
const signUpUseCase = new SignUpUseCase(authRepo);

export function useSignUp() {
  const { setAuth } = useAuthContext();

  return useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      signUpUseCase.execute(name, email, password),
    onSuccess: ({ token, user }) => setAuth(token, user),
  });
}
