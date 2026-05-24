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
    const creds = this.local.getCredentials();
    const localUser = this.local.getUser();

    if (creds) {
      try {
        const result = await this.remote.signIn(creds.email, creds.password);
        this.local.saveToken(result.token);
        this.local.saveUser(result.user);
        return result.user;
      } catch (err: any) {
        if (!err.response) {
          // Network unreachable — offline, use cached user (Rule 2)
          return localUser;
        }
        // HTTP error — credentials rejected, force re-login (Rule 1)
        return null;
      }
    }

    // No stored credentials — use whatever local data exists (null → Welcome page)
    return localUser;
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
