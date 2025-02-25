import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { Products } from '../src/entities/products.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let productsRepository: Repository<Products>;
  let insertedProductIds: number[] = []; // Guardar los IDs de los productos insertados

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    productsRepository = moduleFixture.get<Repository<Products>>(
      getRepositoryToken(Products),
    );

    // Insertar datos de prueba en la base de datos

    const insertedProducts = await productsRepository.insert([
      {
        name: 'Text',
        description: 'Text',
        price: 10.99,
        stock: 10,
        imgUrl: 'Text',
      },
    ]);

    // Guardamos los IDs de los productos insertados
    insertedProductIds = insertedProducts.identifiers.map((id) => id.id);
  });

  afterAll(async () => {
    // Limpiar solo los productos insertados en el test
    if (insertedProductIds.length > 0) {
      await productsRepository.delete(insertedProductIds);
    }

    await app.close();
  });

  it('Debe retornar una lista de productos en formato correcto', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(Array.isArray(response.body.products)).toBe(true);
    expect(response.body.products.length).toBeGreaterThan(0);

    response.body.products.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('stock');
      expect(product).toHaveProperty('imgUrl');
      expect(product).toHaveProperty('category');
    });
  });
});
