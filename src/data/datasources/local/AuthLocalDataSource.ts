import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export class AuthLocalDataSource {
  getToken(): string | null {
    return SecureStore.getItem(TOKEN_KEY);
  }

  saveToken(token: string): void {
    SecureStore.setItem(TOKEN_KEY, token);
  }

  clearToken(): void {
    SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}
