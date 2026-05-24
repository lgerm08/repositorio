import { ITaskRepository } from '../../repositories/ITaskRepository';

export class CreateTaskUseCase {
  constructor(private repo: ITaskRepository) {}

  execute(name: string) {
    return this.repo.createTask(name);
  }
}
