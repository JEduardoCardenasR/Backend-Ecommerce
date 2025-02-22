import { Repository } from 'typeorm';
import { UsersRepository } from './users.repository';
import { Users } from '../entities/users.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let usersRepositoryMock: Repository<Users>;

  const mockUser: Users = {
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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getRepositoryToken(Users),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    usersRepository = module.get<UsersRepository>(UsersRepository);
    usersRepositoryMock = module.get<Repository<Users>>(
      getRepositoryToken(Users),
    );
  });

  it('Debe estar definido el UsersRepository', () => {
    expect(usersRepository).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('Debe retornar un usuario si el email existe', async () => {
      jest.spyOn(usersRepositoryMock, 'findOneBy').mockResolvedValue(mockUser);

      const result = await usersRepository.getUserByEmail('edu@mail.com');

      expect(result).toEqual(mockUser);
      expect(usersRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: 'edu@mail.com',
      });
    });

    it('Debe retornar null si el email no existe', async () => {
      jest.spyOn(usersRepositoryMock, 'findOneBy').mockResolvedValue(null);

      const result = await usersRepository.getUserByEmail('noexiste@mail.com');

      expect(result).toBeNull();
      expect(usersRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: 'noexiste@mail.com',
      });
    });
  });
});
