import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { App } from 'supertest/types';
import { UsersRepository } from '../src/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let mockUsersRepository: Partial<UsersRepository>;
  let jwtService: JwtService;

  const testUser = {
    name: 'Edu',
    email: 'edu@mail.com',
    password: '1234567',
    phone: 123456789,
    country: 'México',
    address: 'Avenida Siempre Viva 123',
    city: 'Saltiyork',
    isAdmin: false,
  };

  beforeEach(async () => {
    mockUsersRepository = {
      getUserByEmail: jest.fn().mockResolvedValue(testUser),
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

  it('POST en la ruta "/auth/singin" debería autenticar el usuario y retornar un token', () => {
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
