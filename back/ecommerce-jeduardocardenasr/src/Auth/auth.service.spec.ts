import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/usersDtos/user.dto';
import { UserResponseDto } from 'src/dtos/usersDtos/user-response.dto';
import { SignUpResponseDto } from 'src/dtos/authDtos/sign-up-response.dto';
import { SignInResponseDto } from 'src/dtos/authDtos/sign-in-response.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepositoryMock: Partial<UsersRepository>;
  let jwtServiceMock: Partial<JwtService>;

  const mockUser: CreateUserDto = {
    name: 'Test User',
    email: 'test@test.com',
    password: '123456',
    confirmPassword: '123456',
    phone: 123456789,
    country: 'Mexico',
    address: 'Always Alive Avenue 123',
    city: 'Saltiyork',
    isAdmin: false,
  };

  const mockExistingUser: UserResponseDto = {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    password: 'hashed-password',
    phone: 123456789,
    country: 'Mexico',
    address: '123 Street',
    city: 'CDMX',
    isAdmin: false,
    orders: [],
  };

  beforeEach(async () => {
    userRepositoryMock = {
      getUserByEmailRepository: jest.fn(),
      createUserRepository: jest.fn(),
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

  it('Service should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUpService', () => {
    it('Should register a user', async () => {
      jest
        .spyOn(userRepositoryMock, 'getUserByEmailRepository')
        .mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
      jest.spyOn(userRepositoryMock, 'createUserRepository').mockResolvedValue({
        ...mockUser,
        password: 'hashed-password',
      });

      const result: SignUpResponseDto =
        await authService.signUpService(mockUser);

      expect(userRepositoryMock.getUserByEmailRepository).toHaveBeenCalledWith(
        mockUser.email,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(userRepositoryMock.createUserRepository).toHaveBeenCalledWith({
        ...mockUser,
        password: 'hashed-password',
      });
      expect(result).toEqual({
        message: expect.any(String),
        createdUser: { ...mockUser, password: 'hashed-password' },
        token: expect.any(String),
      });
    });

    it('Should throw a ConflictException if email has already been register', async () => {
      jest
        .spyOn(userRepositoryMock, 'getUserByEmailRepository')
        .mockResolvedValue(mockExistingUser);

      await expect(authService.signUpService(mockUser)).rejects.toThrow(
        new ConflictException('Email has already been registered'),
      );

      expect(userRepositoryMock.getUserByEmailRepository).toHaveBeenCalledWith(
        'test@test.com',
      );
    });

    it('Should throw a BadRequestException if hashing fails', async () => {
      jest
        .spyOn(userRepositoryMock, 'getUserByEmailRepository')
        .mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(null);

      await expect(authService.signUpService(mockUser)).rejects.toThrow(
        new BadRequestException('Password could not be hashed'),
      );

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    });
  });

  describe('signInService', () => {
    it('Should authenticate a user and give a token in response', async () => {
      jest
        .spyOn(userRepositoryMock, 'getUserByEmailRepository')
        .mockResolvedValue(mockExistingUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result: SignInResponseDto = await authService.signInService(
        'test@test.com',
        '123456',
      );

      expect(userRepositoryMock.getUserByEmailRepository).toHaveBeenCalledWith(
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

    it('Should throw an UnauthorizedException if email is not registered', async () => {
      jest
        .spyOn(userRepositoryMock, 'getUserByEmailRepository')
        .mockResolvedValue(null);

      await expect(
        authService.signInService('test@test.com', '123456'),
      ).rejects.toThrow(new UnauthorizedException('Invalid Credentials'));

      expect(userRepositoryMock.getUserByEmailRepository).toHaveBeenCalledWith(
        'test@test.com',
      );
    });

    it('Should throw an UnauthorizedException if password is not correct', async () => {
      jest
        .spyOn(userRepositoryMock, 'getUserByEmailRepository')
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
