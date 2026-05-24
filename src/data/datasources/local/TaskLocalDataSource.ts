import { Task, SyncStatus } from '../../../core/entities/Task';
import { expoDb } from '../../../infrastructure/database/client';

interface TaskRow {
  id: string;
  server_id: string | null;
  name: string;
  checked: number;
  sync_status: SyncStatus;
  deleted: number;
}

function mapRow(row: TaskRow): Task {
  return {
    id: row.id,
    serverId: row.server_id ?? undefined,
    name: row.name,
    checked: row.checked === 1,
    syncStatus: row.sync_status,
  };
}

export class TaskLocalDataSource {
  getAll(): Task[] {
    const rows = expoDb.getAllSync<TaskRow>(
      'SELECT * FROM tasks WHERE deleted = 0 ORDER BY rowid ASC',
    );
    return rows.map(mapRow);
  }

  getPending(): Task[] {
    const rows = expoDb.getAllSync<TaskRow>(
      "SELECT * FROM tasks WHERE sync_status = 'pending' AND deleted = 0",
    );
    return rows.map(mapRow);
  }

  getPendingDeletes(): Task[] {
    const rows = expoDb.getAllSync<TaskRow>(
      'SELECT * FROM tasks WHERE deleted = 1 AND server_id IS NOT NULL',
    );
    return rows.map(mapRow);
  }

  getById(id: string): Task | null {
    const row = expoDb.getFirstSync<TaskRow>('SELECT * FROM tasks WHERE id = ?', [id]);
    return row ? mapRow(row) : null;
  }

  insert(task: Task): void {
    expoDb.runSync(
      'INSERT INTO tasks (id, server_id, name, checked, sync_status, deleted) VALUES (?, ?, ?, ?, ?, 0)',
      [task.id, task.serverId ?? null, task.name, task.checked ? 1 : 0, task.syncStatus],
    );
  }

  update(id: string, changes: Partial<Pick<Task, 'name' | 'checked' | 'syncStatus' | 'serverId'>>): void {
    const sets: string[] = [];
    const params: (string | number | null)[] = [];

    if (changes.name !== undefined) { sets.push('name = ?'); params.push(changes.name); }
    if (changes.checked !== undefined) { sets.push('checked = ?'); params.push(changes.checked ? 1 : 0); }
    if (changes.syncStatus !== undefined) { sets.push('sync_status = ?'); params.push(changes.syncStatus); }
    if (changes.serverId !== undefined) { sets.push('server_id = ?'); params.push(changes.serverId); }

    if (sets.length === 0) return;
    params.push(id);
    expoDb.runSync(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`, params);
  }

  softDelete(id: string): void {
    expoDb.runSync("UPDATE tasks SET deleted = 1, sync_status = 'pending' WHERE id = ?", [id]);
  }

  hardDelete(id: string): void {
    expoDb.runSync('DELETE FROM tasks WHERE id = ?', [id]);
  }

  upsertFromServer(serverId: string, name: string, checked: boolean): void {
    const existing = expoDb.getFirstSync<TaskRow>(
      'SELECT * FROM tasks WHERE server_id = ?',
      [serverId],
    );
    if (existing) {
      expoDb.runSync(
        "UPDATE tasks SET name = ?, checked = ?, sync_status = 'synced' WHERE server_id = ?",
        [name, checked ? 1 : 0, serverId],
      );
    } else {
      expoDb.runSync(
        "INSERT INTO tasks (id, server_id, name, checked, sync_status, deleted) VALUES (?, ?, ?, ?, 'synced', 0)",
        [generateId(), serverId, name, checked ? 1 : 0],
      );
    }
  }
}

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
