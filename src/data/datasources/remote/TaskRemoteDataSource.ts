import { apiClient } from '../../../infrastructure/api/client';
import '../../../infrastructure/api/interceptors';

export interface RemoteTask {
  id: string;
  name: string;
  checked: boolean;
}

export class TaskRemoteDataSource {
  async getTasks(): Promise<RemoteTask[]> {
    const res = await apiClient.get('/tasks');
    return res.data;
  }

  async createTask(name: string): Promise<RemoteTask> {
    const res = await apiClient.post('/tasks', { name });
    return res.data;
  }

  async updateTask(id: string, changes: { name?: string; checked?: boolean }): Promise<RemoteTask> {
    const res = await apiClient.patch(`/tasks/${id}`, changes);
    return res.data;
  }

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  }
}
