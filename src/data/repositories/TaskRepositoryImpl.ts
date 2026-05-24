import { Task } from '../../core/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { TaskRemoteDataSource } from '../datasources/remote/TaskRemoteDataSource';
import { TaskLocalDataSource } from '../datasources/local/TaskLocalDataSource';
import { AuthLocalDataSource } from '../datasources/local/AuthLocalDataSource';

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export class TaskRepositoryImpl implements ITaskRepository {
  private remote = new TaskRemoteDataSource();
  private local = new TaskLocalDataSource();
  private authLocal = new AuthLocalDataSource();

  private getUserId(): string {
    return this.authLocal.getUser()?.id ?? '';
  }

  async getTasks(): Promise<Task[]> {
    const userId = this.getUserId();
    const localTasks = this.local.getAll(userId);

    if (localTasks.length === 0) {
      // No local tasks — pull from API to seed local (Rule 5)
      try {
        const remoteTasks = await this.remote.getTasks();
        for (const rt of remoteTasks) {
          this.local.upsertFromServer(rt.id, rt.name, rt.checked, userId);
        }
      } catch {
        // offline — return empty list
      }
    } else {
      // Local tasks exist — push pending to API, never overwrite local (Rule 5)
      try {
        await this.syncPending();
      } catch {
        // offline — keep local as-is
      }
    }

    return this.local.getAll(userId);
  }

  async createTask(name: string): Promise<Task> {
    const userId = this.getUserId();
    const localTask: Task = {
      id: generateId(),
      name,
      checked: false,
      syncStatus: 'pending',
    };
    this.local.insert(localTask, userId);

    try {
      const remote = await this.remote.createTask(name);
      this.local.update(localTask.id, { serverId: remote.id, syncStatus: 'synced' });
      return { ...localTask, serverId: remote.id, syncStatus: 'synced' };
    } catch {
      return localTask;
    }
  }

  async updateTask(id: string, changes: { name?: string; checked?: boolean }): Promise<Task> {
    this.local.update(id, { ...changes, syncStatus: 'pending' });
    const task = this.local.getById(id);
    if (!task) throw new Error('Task not found');

    if (task.serverId) {
      try {
        await this.remote.updateTask(task.serverId, changes);
        this.local.update(id, { syncStatus: 'synced' });
        return { ...task, ...changes, syncStatus: 'synced' };
      } catch {
        return { ...task, ...changes };
      }
    }
    return { ...task, ...changes };
  }

  async deleteTask(id: string): Promise<void> {
    const task = this.local.getById(id);
    if (!task) return;

    if (!task.serverId) {
      // Never reached the server — just wipe locally
      this.local.hardDelete(id);
      return;
    }

    this.local.softDelete(id);
    try {
      await this.remote.deleteTask(task.serverId);
      this.local.hardDelete(id);
    } catch {
      // Stays as deleted=1, picked up by syncPending on next sync
    }
  }

  async syncPending(): Promise<void> {
    const userId = this.getUserId();

    const pendingCreates = this.local.getPending(userId).filter((t) => !t.serverId);
    for (const task of pendingCreates) {
      try {
        const remote = await this.remote.createTask(task.name);
        this.local.update(task.id, { serverId: remote.id, syncStatus: 'synced' });
      } catch {
        this.local.update(task.id, { syncStatus: 'failed' });
      }
    }

    const pendingUpdates = this.local.getPending(userId).filter((t) => !!t.serverId);
    for (const task of pendingUpdates) {
      try {
        await this.remote.updateTask(task.serverId!, { name: task.name, checked: task.checked });
        this.local.update(task.id, { syncStatus: 'synced' });
      } catch {
        this.local.update(task.id, { syncStatus: 'failed' });
      }
    }

    const pendingDeletes = this.local.getPendingDeletes(userId);
    for (const task of pendingDeletes) {
      try {
        await this.remote.deleteTask(task.serverId!);
      } catch {
        // ignore — row stays for next retry
      } finally {
        this.local.hardDelete(task.id);
      }
    }
  }
}
