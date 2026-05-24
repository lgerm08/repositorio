import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { useSession } from '../hooks/auth/useSession';
import { useAppTheme } from '../theme/useAppTheme';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { RootStackParamList } from './types';
import { SplashScreen } from '../screens/SplashScreen';

const prefix = Linking.createURL('/');


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const linking: any = {
  prefixes: [prefix, 'segurali://'],
  config: {
    screens: {
      App: {
        screens: {
          Home: '',
          Profile: 'perfil',
        },
      },
      Auth: {
        screens: {
          SignIn: 'sign-in',
          SignUp: 'sign-up',
        },
      },
    },
  },
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useSession();
  const { colors, isDark } = useAppTheme();

  const navTheme = isDark
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.background } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background } };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer linking={linking} theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
