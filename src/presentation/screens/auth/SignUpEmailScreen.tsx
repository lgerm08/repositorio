import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { AuthStepScreen } from '../../components/AuthStepScreen';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUpEmail'>;

export function SignUpEmailScreen({ navigation, route }: Props) {
  const [email, setEmail] = useState('');

  return (
    <AuthStepScreen
      title="Qual é o seu e-mail?"
      placeholder="johndoe@exemplo.com"
      value={email}
      onChangeValue={setEmail}
      onBack={() => navigation.goBack()}
      onContinue={() =>
        navigation.navigate('SignUpPassword', { name: route.params.name, email })
      }
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}
