import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/Users/users.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UsersRepository) {}

  getAuth(): string {
    return 'Logged in';
  }

  signInService(email: string, password: string) {
    if (!email || !password) return 'Data required';

    const user = this.userRepository.getUserByEmail(email);

    if (!user) return 'Invalid Credentials';

    if (user.password === password) return 'Logged in';

    return 'Invalid Credentials';
  }
}
