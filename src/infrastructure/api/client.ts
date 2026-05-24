import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api-teste-mobile.fly.dev',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});
