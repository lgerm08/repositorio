import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { SignUpNameScreen } from '../screens/auth/SignUpNameScreen';
import { SignUpEmailScreen } from '../screens/auth/SignUpEmailScreen';
import { SignUpPasswordScreen } from '../screens/auth/SignUpPasswordScreen';
import { SignInEmailScreen } from '../screens/auth/SignInEmailScreen';
import { SignInPasswordScreen } from '../screens/auth/SignInPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignUpName" component={SignUpNameScreen} />
      <Stack.Screen name="SignUpEmail" component={SignUpEmailScreen} />
      <Stack.Screen name="SignUpPassword" component={SignUpPasswordScreen} />
      <Stack.Screen name="SignInEmail" component={SignInEmailScreen} />
      <Stack.Screen name="SignInPassword" component={SignInPasswordScreen} />
    </Stack.Navigator>
  );
}
