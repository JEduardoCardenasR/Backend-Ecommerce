import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dtos/usersDtos/user.dto';
import { SignUpResponseDto } from '../dtos/authDtos/sign-up-response.dto';
import { UserResponseDto } from 'src/dtos/usersDtos/user-response.dto';
import { IJwtPayload } from 'src/interfaces/jwtPayload.interface';
import { SignInResponseDto } from 'src/dtos/authDtos/sign-in-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  // getAuth(): string {
  //   return 'Logged in';
  // }

  //Registro de usuario:
  async signUpService(user: CreateUserDto): Promise<SignUpResponseDto> {
    //Validación de datos
    const { email, password }: { email: string; password: string } = user;

    if (!email || !password)
      throw new BadRequestException('Email and password are required');

    //Verificar si extiste el usuario (mail)
    const foundUser: UserResponseDto =
      await this.userRepository.getUserByEmailRepository(email);

    if (foundUser)
      throw new BadRequestException('Email has already been registered');

    //Verificar si existen las contraseñas (Ya se está validando en el DTO)
    // if (password !== user.confirmPassword)
    //   throw new BadRequestException('Passwords do not match');

    //Proceso de registro

    //Hashear el password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    if (!hashedPassword)
      throw new BadRequestException('Password could not be hashed');

    //Guardar el usuario en la base de datos

    const savedUser: Partial<UserResponseDto> =
      await this.userRepository.createUserRepository({
        ...user,
        password: hashedPassword,
      });

    //Hacemos sigIn para mejorar la experiencia de usuario:

    const payload: IJwtPayload = {
      id: savedUser.id,
      email: savedUser.email,
      isAdmin: savedUser.isAdmin,
    };

    //Generamos el token:
    const token: string = this.jwtService.sign(payload);

    //Entregamos la respuesta:
    return {
      message: 'Successfully Signed-Up User',
      createdUser: savedUser,
      token,
    };
  }

  async signInService(
    email: string,
    password: string,
  ): Promise<SignInResponseDto> {
    //Validamos datos
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    //Consultamos en DB por el usuaario mediante su email:
    const user: UserResponseDto =
      await this.userRepository.getUserByEmailRepository(email);

    //Validamos si existe el usuario:
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    //Comparación de contraseñas:
    const validPassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    //Si las contraseñas coinciden, le pasamos la firma el token:

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    //Generamos el token:
    const token: string = this.jwtService.sign(payload);

    //Entregamos la respuesta:
    return {
      message: 'Successfully Logged-in User',
      token,
    };
  }
}
