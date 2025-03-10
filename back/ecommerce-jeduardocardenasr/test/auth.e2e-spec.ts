import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersRepository } from '../src/users/users.repository';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: UsersRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<UsersRepository>(UsersRepository);

    // Asegurar que haya un usuario en la base de datos para probar login
    await userRepository.createUserRepository({
      name: 'Test User',
      email: 'auth@test.com',
      password: await bcrypt.hash('password123', 10), // Hasheamos la contraseña
      phone: 123456789,
      country: 'México',
      address: 'Calle 123',
      city: 'CDMX',
      isAdmin: false,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should sing in and give a valid token in response', async () => {
    const response: request.Response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'auth@test.com', password: 'password123' })
      .expect(201);

    expect(response.body).toHaveProperty('token');
  });

  it('Should fail with the wrong credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'auth@test.com', password: 'wrongpassword' })
      .expect(401);
  });

  it('Should fail if data is not sent within the request', async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({})
      .expect(400);
  });
});
