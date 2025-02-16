import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from 'src/Users/users.repository';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities/users.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  getAuth(): string {
    return 'Logged in';
  }

  //Registro de usuario:
  async signUpService(user: Partial<Users>) {
    //Validación de datos
    const { email, password } = user;

    if (!email || !password)
      throw new BadRequestException('Required email and password');

    const foundUser = await this.userRepository.getUserByEmail(email);

    if (foundUser)
      throw new BadRequestException('Email already been registered');

    //Proceso de registro

    //Hashear el password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Guardar el usuario en la base de datos
    return await this.userRepository.createUser({
      ...user,
      password: hashedPassword,
    });
  }

  async signInService(email: string, password: string) {
    //Validamos datos
    if (!email || !password) {
      throw new BadRequestException('Email y contraseña son requeridos');
    }

    //Consultamos en DB por el usuaario mediante su email:
    const user = await this.userRepository.getUserByEmail(email);

    //Validamos si existe el usuario:
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    //Comparación de contraseñas:
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    //Si las contraseñas coinciden, le pasamos la firma el token:

    const payload = {
      id: user.id,
      email: user.email,
    };

    //Generamos el token:
    const token = this.jwtService.sign(payload);

    //Entregamos la respuesta:
    return {
      message: 'Logged-in User',
      token,
    };
  }
}
