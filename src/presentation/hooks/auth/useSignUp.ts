import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { AuthRepositoryImpl } from '../../../data/repositories/AuthRepositoryImpl';
import { SignUpUseCase } from '../../../domain/usecases/auth/SignUpUseCase';
import { useAuthContext } from '../../context/AuthContext';

const authRepo = new AuthRepositoryImpl();
const signUpUseCase = new SignUpUseCase(authRepo);

function parseErrorMessage(error: unknown): string {
  const e = error as any;
  const data = e?.response?.data;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (data?.type === 'validation') return 'Verifique os dados informados e tente novamente.';
  return 'Não foi possível criar sua conta. Tente novamente.';
}

export function useSignUp() {
  const { setAuth } = useAuthContext();

  return useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      signUpUseCase.execute(name, email, password),
    onSuccess: ({ token, user }) => setAuth(token, user),
    onError: (error) => {
      Alert.alert('Erro ao criar conta', parseErrorMessage(error));
    },
  });
}
