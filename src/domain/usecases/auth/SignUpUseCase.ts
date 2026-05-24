import { IAuthRepository } from '../../repositories/IAuthRepository';

export class SignUpUseCase {
  constructor(private repo: IAuthRepository) {}

  execute(name: string, email: string, password: string) {
    return this.repo.signUp(name, email, password);
  }
}
