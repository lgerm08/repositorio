import * as SecureStore from 'expo-secure-store';
import { apiClient } from './client';

const TOKEN_KEY = 'auth_token';

apiClient.interceptors.request.use((config) => {
  const token = SecureStore.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    return Promise.reject(error);
  },
);
