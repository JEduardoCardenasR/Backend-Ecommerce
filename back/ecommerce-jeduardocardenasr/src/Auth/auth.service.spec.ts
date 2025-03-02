import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dtos/user.dto';
import { Users } from 'src/entities/users.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepositoryMock: Partial<UsersRepository>;
  let jwtServiceMock: Partial<JwtService>;

  const mockUser: CreateUserDto = {
    name: 'Test User',
    email: 'test@test.com',
    password: '123456',
    confirmPassword: '123456', // Necesario en CreateUserDto
    phone: 123456789,
    country: 'México',
    address: 'Avenida Siempre Viva 123',
    city: 'Saltiyork',
    isAdmin: false,
  };

  const mockExistingUser: Users = {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    password: 'hashed-password',
    phone: 123456789,
    country: 'México',
    address: 'Calle 123',
    city: 'CDMX',
    isAdmin: false,
    orders: [], // Agregar si 'Users' lo requiere
  };

  beforeEach(async () => {
    userRepositoryMock = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: userRepositoryMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('Debe estar definido', () => {
    expect(authService).toBeDefined();
  });

  describe('signUpService', () => {
    it('Debe registrar un usuario si los datos son válidos', async () => {
      jest.spyOn(userRepositoryMock, 'getUserByEmail').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
      jest.spyOn(userRepositoryMock, 'createUser').mockResolvedValue({
        ...mockUser,
        password: 'hashed-password',
      });

      const result = await authService.signUpService(mockUser);

      expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith(
        mockUser.email,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(userRepositoryMock.createUser).toHaveBeenCalledWith({
        ...mockUser,
        password: 'hashed-password',
      });
      expect(result).toEqual({ ...mockUser, password: 'hashed-password' });
    });

    it('Debe lanzar BadRequestException si el email ya está registrado', async () => {
      jest
        .spyOn(userRepositoryMock, 'getUserByEmail')
        .mockResolvedValue(mockExistingUser);

      await expect(authService.signUpService(mockUser)).rejects.toThrow(
        new BadRequestException('Email has already been registered'),
      );

      expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith(
        'test@test.com',
      );
    });

    it('Debe lanzar BadRequestException si el hashing falla', async () => {
      jest.spyOn(userRepositoryMock, 'getUserByEmail').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(null);

      await expect(authService.signUpService(mockUser)).rejects.toThrow(
        new BadRequestException('Password could not be hashed'),
      );

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    });
  });

  describe('signInService', () => {
    it('Debe autenticar un usuario válido y devolver un token', async () => {
      jest
        .spyOn(userRepositoryMock, 'getUserByEmail')
        .mockResolvedValue(mockExistingUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.signInService('test@test.com', '123456');

      expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith(
        'test@test.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashed-password');
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        id: '1',
        email: 'test@test.com',
        isAdmin: false,
      });
      expect(result).toEqual({
        message: 'Successfully Logged-in User',
        token: 'mocked-jwt-token',
      });
    });

    it('Debe lanzar UnauthorizedException si el usuario no existe', async () => {
      jest.spyOn(userRepositoryMock, 'getUserByEmail').mockResolvedValue(null);

      await expect(
        authService.signInService('test@test.com', '123456'),
      ).rejects.toThrow(new UnauthorizedException('Invalid Credentials'));

      expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith(
        'test@test.com',
      );
    });

    it('Debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      jest
        .spyOn(userRepositoryMock, 'getUserByEmail')
        .mockResolvedValue(mockExistingUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        authService.signInService('test@test.com', 'wrong-password'),
      ).rejects.toThrow(new UnauthorizedException('Invalid Credentials'));

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrong-password',
        'hashed-password',
      );
    });
  });
});
