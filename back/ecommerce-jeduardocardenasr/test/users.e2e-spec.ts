import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersRepository } from '../src/users/users.repository';
import * as bcrypt from 'bcrypt';

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
    const user = await userRepository.createUser({
      name: 'Test User',
      email: 'users@example.com',
      password: await bcrypt.hash('password123', 10),
      phone: 123456789,
      country: 'México',
      address: 'Calle 123',
      city: 'CDMX',
      isAdmin: false,
    });

    testUserId = user.id; // Guardamos el ID del usuario de prueba

    // Obtener token de autenticación
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'users@example.com', password: 'password123' });
    authToken = response.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Debe obtener un usuario existente por ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`) // Enviar el token de autenticación
      .expect(200);

    expect(response.body).toHaveProperty('id', testUserId);
    expect(response.body).toHaveProperty('name', 'Test User');
  });

  it('Debe devolver 404 si el usuario no existe', async () => {
    const fakeUserId = '11111111-1111-1111-1111-111111111111'; // UUID inválido
    await request(app.getHttpServer())
      .get(`/users/${fakeUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });
});
