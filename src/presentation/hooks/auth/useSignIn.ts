import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { AuthRepositoryImpl } from '../../../data/repositories/AuthRepositoryImpl';
import { SignInUseCase } from '../../../domain/usecases/auth/SignInUseCase';
import { useAuthContext } from '../../context/AuthContext';

const authRepo = new AuthRepositoryImpl();
const signInUseCase = new SignInUseCase(authRepo);

function parseErrorMessage(error: unknown): string {
  const e = error as any;
  const data = e?.response?.data;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (data?.type === 'validation') return 'Verifique os dados informados e tente novamente.';
  return 'Não foi possível entrar. Tente novamente.';
}

export function useSignIn() {
  const { setAuth } = useAuthContext();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signInUseCase.execute(email, password),
    onSuccess: ({ token, user }) => setAuth(token, user),
    onError: (error) => {
      Alert.alert('Erro ao entrar', parseErrorMessage(error));
    },
  });
}
