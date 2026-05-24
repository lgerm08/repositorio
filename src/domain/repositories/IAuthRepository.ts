import { User } from '../../core/entities/User';

export interface IAuthRepository {
  signIn(email: string, password: string): Promise<{ token: string; user: User }>;
  signUp(name: string, email: string, password: string): Promise<{ token: string; user: User }>;
  getSession(): Promise<User | null>;
  saveToken(token: string): void;
  getToken(): string | null;
  clearToken(): void;
}
