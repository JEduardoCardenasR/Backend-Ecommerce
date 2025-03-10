import { UsersController } from './users.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthGuard } from '../Auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from '../dtos/usersDtos/user-response.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;

  const mockUsers: UserResponseDto[] = [
    {
      id: '1',
      name: 'Edu',
      email: 'edu@mail.com',
      password: '1234567',
      phone: 123456789,
      country: 'Mexico',
      address: 'ALways Alive Avenue 123',
      city: 'SaltiYork',
      isAdmin: false,
      orders: [],
    },
    {
      id: '2',
      name: 'Petronilo',
      email: 'petro@mail.com',
      password: '1234567',
      phone: 123456789,
      country: 'Mexico',
      address: 'ALways Alive Avenue 123',
      city: 'SaltiYork',
      isAdmin: false,
      orders: [],
    },
  ];

  beforeEach(async () => {
    mockUsersService = {
      getUsersService: jest.fn().mockResolvedValue(mockUsers),
      getUserByIdService: jest.fn().mockImplementation((id) => {
        const user: UserResponseDto = mockUsers.find((u) => u.id === id);
        if (!user)
          return Promise.reject(
            new NotFoundException(`User with id ${id} was not found`),
          );
        return Promise.resolve(user);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
            verify: jest.fn().mockReturnValue({ userId: 'mock-user-id' }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    mockUsersService = module.get<UsersService>(UsersService);
  });

  it('The controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('Should return a list of users', async () => {
      const result: UserResponseDto[] = await controller.getUsersController();
      expect(result).toEqual(mockUsers);
      expect(mockUsersService.getUsersService).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('Should return a user if ID exists', async () => {
      const userId: string = '1';
      const result: UserResponseDto =
        await controller.getUserByIdController(userId);
      expect(result).toEqual(mockUsers[Number(userId) - 1]);
      expect(mockUsersService.getUserByIdService).toHaveBeenCalledWith(userId);
    });

    it('Should throw a NotFoundException if user ID does not exist', async () => {
      const nonExistentUserId: string = '3';
      await expect(
        controller.getUserByIdController(nonExistentUserId),
      ).rejects.toThrow(NotFoundException);

      expect(mockUsersService.getUserByIdService).toHaveBeenCalledWith(
        nonExistentUserId,
      );
    });
  });
});
