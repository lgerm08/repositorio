import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { AuthStepScreen } from '../../components/AuthStepScreen';
import { useSignIn } from '../../hooks/auth/useSignIn';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignInPassword'>;

export function SignInPasswordScreen({ navigation, route }: Props) {
  const [password, setPassword] = useState('');
  const { email } = route.params;
  const { mutate: signIn, isPending } = useSignIn();

  return (
    <AuthStepScreen
      title="Qual é a sua senha?"
      placeholder="********"
      value={password}
      onChangeValue={setPassword}
      onBack={() => navigation.goBack()}
      onContinue={() => signIn({ email, password })}
      secureTextEntry
      autoCapitalize="none"
      autoCorrect={false}
      buttonLabel="Entrar"
      buttonPrimary
      loading={isPending}

    />
  );
}
