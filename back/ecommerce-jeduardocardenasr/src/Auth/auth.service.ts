import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../Users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../Users/user.dto';

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
  async signUpService(user: CreateUserDto) {
    //Validación de datos
    const { email, password } = user;

    if (!email || !password)
      throw new BadRequestException('Required email and password');

    //Verificar si extiste el usuario (mail)
    const foundUser = await this.userRepository.getUserByEmail(email);

    if (foundUser)
      throw new BadRequestException('Email has already been registered');

    //Verificar si existen las contraseñas (Ya se está validando en el DTO)
    // if (password !== user.confirmPassword)
    //   throw new BadRequestException('Passwords do not match');

    //Proceso de registro

    //Hashear el password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword)
      throw new BadRequestException('Password could not be hashed');

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
      isAdmin: user.isAdmin,
    };

    //Generamos el token:
    const token = this.jwtService.sign(payload);

    //Entregamos la respuesta:
    return {
      message: 'Successfully Logged-in User',
      token,
    };
  }
}
