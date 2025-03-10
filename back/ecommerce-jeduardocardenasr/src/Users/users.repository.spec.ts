import { Repository } from 'typeorm';
import { UsersRepository } from './users.repository';
import { Users } from '../entities/users.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserResponseDto } from '../dtos/usersDtos/user-response.dto';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let usersRepositoryMock: Repository<Users>;

  const mockUser: UserResponseDto = {
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

  it('Repository should be defined', () => {
    expect(usersRepository).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('Should return a user if email exist', async () => {
      jest.spyOn(usersRepositoryMock, 'findOneBy').mockResolvedValue(mockUser);

      const result: UserResponseDto =
        await usersRepository.getUserByEmailRepository('edu@mail.com');

      expect(result).toEqual(mockUser);
      expect(usersRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: 'edu@mail.com',
      });
    });

    it('Should return null if email does not exist', async () => {
      jest.spyOn(usersRepositoryMock, 'findOneBy').mockResolvedValue(null);

      const result: UserResponseDto =
        await usersRepository.getUserByEmailRepository('noexiste@mail.com');

      expect(result).toBeNull();
      expect(usersRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: 'noexiste@mail.com',
      });
    });
  });
});
