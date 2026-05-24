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
    this.local.saveUser(result.user);
    this.local.saveCredentials(email, password);
    return result;
  }

  async signUp(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const result = await this.remote.signUp(name, email, password);
    this.local.saveToken(result.token);
    this.local.saveUser(result.user);
    this.local.saveCredentials(email, password);
    return result;
  }

  async getSession(): Promise<User | null> {
    // 1. Try session API with stored token
    const token = this.local.getToken();
    if (token) {
      try {
        const apiUser = await this.remote.getSession();
        this.local.saveUser(apiUser);
        return apiUser;
      } catch {
        // token invalid or no network — fall through
      }
    }

    // 2. Try re-authenticating with stored credentials (handles token expiry and reloads)
    const creds = this.local.getCredentials();
    if (creds) {
      try {
        const result = await this.remote.signIn(creds.email, creds.password);
        this.local.saveToken(result.token);
        this.local.saveUser(result.user);
        return result.user;
      } catch {
        // API unreachable — fall through to local user
      }
    }

    // 3. Offline fallback: return locally cached user data
    return this.local.getUser();
  }

  saveToken(token: string): void {
    this.local.saveToken(token);
  }

  getToken(): string | null {
    return this.local.getToken();
  }

  clearToken(): void {
    this.local.clearToken();
    this.local.clearUser();
    this.local.clearCredentials();
  }
}
