import { IAuthRepository } from '../../repositories/IAuthRepository';

export class SignInUseCase {
  constructor(private repo: IAuthRepository) {}

  execute(email: string, password: string) {
    return this.repo.signIn(email, password);
  }
}
