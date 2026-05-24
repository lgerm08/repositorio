import { ITaskRepository } from '../../repositories/ITaskRepository';

export class UpdateTaskUseCase {
  constructor(private repo: ITaskRepository) {}

  execute(id: string, changes: { name?: string; checked?: boolean }) {
    return this.repo.updateTask(id, changes);
  }
}
