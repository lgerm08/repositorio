import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { AuthStepScreen } from '../../components/AuthStepScreen';
import { useSignUp } from '../../hooks/auth/useSignUp';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUpPassword'>;

export function SignUpPasswordScreen({ navigation, route }: Props) {
  const [password, setPassword] = useState('');
  const { name, email } = route.params;
  const { mutate: signUp, isPending } = useSignUp();

  return (
    <AuthStepScreen
      title="Qual é a sua senha?"
      placeholder="********"
      value={password}
      onChangeValue={setPassword}
      onBack={() => navigation.goBack()}
      onContinue={() => signUp({ name, email, password })}
      secureTextEntry
      autoCapitalize="none"
      autoCorrect={false}
      buttonLabel="Criar conta"
      buttonPrimary
      loading={isPending}

    />
  );
}
