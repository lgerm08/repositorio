import { User } from '../../../core/entities/User';
import { expoDb } from '../../../infrastructure/database/client';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const EMAIL_KEY = 'auth_email';
const PASSWORD_KEY = 'auth_password';

function get(key: string): string | null {
  try {
    const row = expoDb.getFirstSync<{ value: string }>(
      'SELECT value FROM auth WHERE key = ?',
      [key],
    );
    return row?.value ?? null;
  } catch {
    return null;
  }
}

function set(key: string, value: string): void {
  try {
    expoDb.runSync(
      'INSERT OR REPLACE INTO auth (key, value) VALUES (?, ?)',
      [key, value],
    );
  } catch {
    // table may not exist yet during first migration
  }
}

function del(key: string): void {
  try {
    expoDb.runSync('DELETE FROM auth WHERE key = ?', [key]);
  } catch {}
}

export class AuthLocalDataSource {
  getToken(): string | null {
    return get(TOKEN_KEY);
  }

  saveToken(token: string): void {
    set(TOKEN_KEY, token);
  }

  clearToken(): void {
    del(TOKEN_KEY);
  }

  getUser(): User | null {
    const raw = get(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as User; } catch { return null; }
  }

  saveUser(user: User): void {
    set(USER_KEY, JSON.stringify(user));
  }

  clearUser(): void {
    del(USER_KEY);
  }

  getCredentials(): { email: string; password: string } | null {
    const email = get(EMAIL_KEY);
    const password = get(PASSWORD_KEY);
    if (!email || !password) return null;
    return { email, password };
  }

  saveCredentials(email: string, password: string): void {
    set(EMAIL_KEY, email);
    set(PASSWORD_KEY, password);
  }

  clearCredentials(): void {
    del(EMAIL_KEY);
    del(PASSWORD_KEY);
  }
}
