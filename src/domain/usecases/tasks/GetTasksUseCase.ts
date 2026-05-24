import { ITaskRepository } from '../../repositories/ITaskRepository';

export class GetTasksUseCase {
  constructor(private repo: ITaskRepository) {}

  execute() {
    return this.repo.getTasks();
  }
}
