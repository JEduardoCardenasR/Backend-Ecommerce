import { Users } from '../entities/users.entity';
import { UsersController } from './users.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthGuard } from '../Auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService;

  const mockUsers: Users[] = [
    {
      id: '1',
      name: 'Edu',
      email: 'edu@mail.com',
      password: '1234567',
      phone: 123456789,
      country: 'México',
      address: 'Avenida Siempre Viva 123',
      city: 'Saltiyork',
      isAdmin: false,
      orders: [],
    },
    {
      id: '2',
      name: 'Pedtronilo',
      email: 'petro@mail.com',
      password: '1234567',
      phone: 123456789,
      country: 'México',
      address: 'Avenida Siempre Viva 123',
      city: 'Saltiyork',
      isAdmin: false,
      orders: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsersService: jest.fn().mockResolvedValue(mockUsers),
            getUserByIdService: jest.fn().mockResolvedValue(mockUsers[0]),
          },
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

  it('Debe estar definido el controlador', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('Debe retornar una lista de usuarios', async () => {
      const result = await controller.getUsersController();
      expect(result).toEqual(mockUsers);
      expect(mockUsersService.getUsersService).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('Debe retornar un usuario', async () => {
      const result = await controller.getUserByIdController('1');
      expect(result).toEqual(mockUsers[0]);
      expect(mockUsersService.getUserByIdService).toHaveBeenCalledWith('1');
    });
  });
});
