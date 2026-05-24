import { expoDb } from './client';

export function runMigrations(): void {
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      server_id TEXT,
      name TEXT NOT NULL,
      checked INTEGER NOT NULL DEFAULT 0,
      sync_status TEXT NOT NULL DEFAULT 'pending',
      deleted INTEGER NOT NULL DEFAULT 0
    );
  `);
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS auth (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}
