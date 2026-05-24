import { Task } from '../../core/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { TaskRemoteDataSource } from '../datasources/remote/TaskRemoteDataSource';
import { TaskLocalDataSource } from '../datasources/local/TaskLocalDataSource';

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export class TaskRepositoryImpl implements ITaskRepository {
  private remote = new TaskRemoteDataSource();
  private local = new TaskLocalDataSource();

  async getTasks(): Promise<Task[]> {
    // Return local immediately, sync from remote in background
    const localTasks = this.local.getAll();
    this.refreshFromRemote().catch(() => null);
    return localTasks;
  }

  private async refreshFromRemote(): Promise<void> {
    const remoteTasks = await this.remote.getTasks();
    for (const rt of remoteTasks) {
      this.local.upsertFromServer(rt.id, rt.name, rt.checked);
    }
  }

  async createTask(name: string): Promise<Task> {
    const localTask: Task = {
      id: generateId(),
      name,
      checked: false,
      syncStatus: 'pending',
    };
    this.local.insert(localTask);

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

    this.local.softDelete(id);

    if (task.serverId) {
      try {
        await this.remote.deleteTask(task.serverId);
      } catch {
        // Will retry in syncPending
      }
    }
    this.local.hardDelete(id);
  }

  async syncPending(): Promise<void> {
    // Sync pending creates
    const pendingCreates = this.local.getPending().filter((t) => !t.serverId);
    for (const task of pendingCreates) {
      try {
        const remote = await this.remote.createTask(task.name);
        this.local.update(task.id, { serverId: remote.id, syncStatus: 'synced' });
      } catch {
        this.local.update(task.id, { syncStatus: 'failed' });
      }
    }

    // Sync pending updates
    const pendingUpdates = this.local.getPending().filter((t) => !!t.serverId);
    for (const task of pendingUpdates) {
      try {
        await this.remote.updateTask(task.serverId!, { name: task.name, checked: task.checked });
        this.local.update(task.id, { syncStatus: 'synced' });
      } catch {
        this.local.update(task.id, { syncStatus: 'failed' });
      }
    }

    // Sync pending deletes
    const pendingDeletes = this.local.getPendingDeletes();
    for (const task of pendingDeletes) {
      try {
        await this.remote.deleteTask(task.serverId!);
      } catch {
        // ignore
      } finally {
        this.local.hardDelete(task.id);
      }
    }
  }
}
