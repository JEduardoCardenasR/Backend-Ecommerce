import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from 'src/Users/users.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UsersRepository) {}

  getAuth(): string {
    return 'Logged in';
  }

  async signInService(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email y contraseña son requeridos');
    }

    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return 'Logged in';
  }
}
