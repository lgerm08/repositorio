import { ITaskRepository } from '../../repositories/ITaskRepository';

export class DeleteTaskUseCase {
  constructor(private repo: ITaskRepository) {}

  execute(id: string) {
    return this.repo.deleteTask(id);
  }
}
