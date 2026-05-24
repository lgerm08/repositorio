import { IAuthRepository } from '../../repositories/IAuthRepository';

export class GetSessionUseCase {
  constructor(private repo: IAuthRepository) {}

  execute() {
    return this.repo.getSession();
  }
}
