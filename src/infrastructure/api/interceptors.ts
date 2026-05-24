import { apiClient } from './client';
import { expoDb } from '../database/client';

const TOKEN_KEY = 'auth_token';

function getStoredToken(): string | null {
  try {
    const row = expoDb.getFirstSync<{ value: string }>(
      'SELECT value FROM auth WHERE key = ?',
      [TOKEN_KEY],
    );
    return row?.value ?? null;
  } catch {
    return null;
  }
}

function clearStoredToken(): void {
  try {
    expoDb.runSync('DELETE FROM auth WHERE key = ?', [TOKEN_KEY]);
  } catch {}
}

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredToken();
    }
    return Promise.reject(error);
  },
);
