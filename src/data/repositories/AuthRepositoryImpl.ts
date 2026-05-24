import { User } from '../../core/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { AuthRemoteDataSource } from '../datasources/remote/AuthRemoteDataSource';
import { AuthLocalDataSource } from '../datasources/local/AuthLocalDataSource';

export class AuthRepositoryImpl implements IAuthRepository {
  private remote = new AuthRemoteDataSource();
  private local = new AuthLocalDataSource();

  async signIn(email: string, password: string): Promise<{ token: string; user: User }> {
    const result = await this.remote.signIn(email, password);
    this.local.saveToken(result.token);
    return result;
  }

  async signUp(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const result = await this.remote.signUp(name, email, password);
    this.local.saveToken(result.token);
    return result;
  }

  async getSession(): Promise<User | null> {
    const token = this.local.getToken();
    if (!token) return null;
    try {
      return await this.remote.getSession();
    } catch {
      return null;
    }
  }

  saveToken(token: string): void {
    this.local.saveToken(token);
  }

  getToken(): string | null {
    return this.local.getToken();
  }

  clearToken(): void {
    this.local.clearToken();
  }
}
