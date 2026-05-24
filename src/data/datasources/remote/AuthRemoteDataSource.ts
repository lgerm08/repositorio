import { User } from '../../../core/entities/User';
import { apiClient } from '../../../infrastructure/api/client';
import '../../../infrastructure/api/interceptors';

export class AuthRemoteDataSource {
  async signIn(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await apiClient.post('/auth/sign-in/email', { email, password });
    return res.data;
  }

  async signUp(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await apiClient.post('/auth/sign-up/email', { name, email, password });
    return res.data;
  }

  async getSession(): Promise<User> {
    const res = await apiClient.get('/auth/session');
    return res.data;
  }
}
