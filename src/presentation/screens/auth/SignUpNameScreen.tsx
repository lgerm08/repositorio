import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { AuthStepScreen } from '../../components/AuthStepScreen';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUpName'>;

export function SignUpNameScreen({ navigation }: Props) {
  const [name, setName] = useState('');

  return (
    <AuthStepScreen
      title="Qual é o seu nome?"
      placeholder="John Doe"
      value={name}
      onChangeValue={setName}
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate('SignUpEmail', { name })}
      autoCapitalize="words"
      autoCorrect={false}
    />
  );
}
