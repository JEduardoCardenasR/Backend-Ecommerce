import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { In, Repository } from 'typeorm';
import { Categories } from '../src/entities/categories.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let categoriesRepository: Repository<Categories>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    categoriesRepository = moduleFixture.get<Repository<Categories>>(
      getRepositoryToken(Categories),
    );

    // Insertamos datos de prueba en la base de datos
    await categoriesRepository.insert([
      { name: 'Electronics' },
      { name: 'Clothing' },
      { name: 'Home & Kitchen' },
    ]);
  });

  afterAll(async () => {
    // Eliminar solo las categorías insertadas durante el test
    await categoriesRepository.delete({
      name: In(['Electronics', 'Clothing', 'Home & Kitchen']),
    });
    await app.close();
  });

  it('Should return a list of categories', async () => {
    const response: request.Response = await request(app.getHttpServer())
      .get('/categories')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(3);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Electronics' }),
        expect.objectContaining({ name: 'Clothing' }),
        expect.objectContaining({ name: 'Home & Kitchen' }),
      ]),
    );
  });
});
