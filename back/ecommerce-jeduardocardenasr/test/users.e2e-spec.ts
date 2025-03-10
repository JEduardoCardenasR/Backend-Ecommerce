import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersRepository } from '../src/users/users.repository';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../src/dtos/usersDtos/user-response.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepository: UsersRepository;
  let testUserId: string;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<UsersRepository>(UsersRepository);

    // Crear un usuario de prueba
    const user: Partial<UserResponseDto> =
      await userRepository.createUserRepository({
        name: 'Test User',
        email: 'users@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: 123456789,
        country: 'Mexico',
        address: '123 Street',
        city: 'CDMX',
        isAdmin: false,
      });

    testUserId = user.id; // Guardamos el ID del usuario de prueba

    // Obtener token de autenticación
    const response: request.Response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'users@example.com', password: 'password123' });
    authToken = response.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should get an existing user by ID', async () => {
    const response: request.Response = await request(app.getHttpServer())
      .get(`/users/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`) // Enviar el token de autenticación
      .expect(200);

    expect(response.body).toHaveProperty('id', testUserId);
    expect(response.body).toHaveProperty('name', 'Test User');
  });

  it('Should throw 404 if user does not exist', async () => {
    const fakeUserId: string = '11111111-1111-1111-1111-111111111111'; // UUID inválido
    await request(app.getHttpServer())
      .get(`/users/${fakeUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });
});
