import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  // Sign-up flow
  SignUpName: undefined;
  SignUpEmail: { name: string };
  SignUpPassword: { name: string; email: string };
  // Sign-in flow
  SignInEmail: undefined;
  SignInPassword: { email: string };
};

export type AppStackParamList = {
  Home: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
