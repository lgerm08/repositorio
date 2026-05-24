import { Task } from '../../core/entities/Task';

export interface ITaskRepository {
  getTasks(): Promise<Task[]>;
  createTask(name: string): Promise<Task>;
  updateTask(id: string, changes: { name?: string; checked?: boolean }): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  syncPending(): Promise<void>;
}
