import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { App } from 'supertest/types';
import { UsersRepository } from '../src/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../src/dtos/usersDtos/user.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let mockUsersRepository: Partial<UsersRepository>;
  let jwtService: JwtService;

  const testUser: CreateUserDto = {
    name: 'Edu',
    email: 'edu@mail.com',
    password: '1234567',
    confirmPassword: '1234567',
    phone: 123456789,
    country: 'Mexico',
    address: 'Always Alive Avenue 123',
    city: 'SaltiYork',
    isAdmin: false,
  };

  beforeEach(async () => {
    mockUsersRepository = {
      getUserByEmailRepository: jest.fn().mockResolvedValue(testUser),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersRepository)
      .useValue(mockUsersRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    jest.spyOn(bcrypt, 'compare').mockImplementation((password, hash) => {
      return Promise.resolve(password === '1234567');
    });
  });

  it('Route Post in "/auth/singin" should authenticate a user and give a token in response', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'edu@mail.com', password: '1234567' })
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
        expect(res.body.token).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
