import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Products } from '../src/entities/products.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Orders } from '../src/entities/orders.entity';
import * as bcrypt from 'bcrypt';
import { Users } from '../src/entities/users.entity';
import { UserResponseDto } from '../src/dtos/usersDtos/user-response.dto';
import { ProductResponseDto } from '../src/dtos/productsDtos/product-response.dto';
import { IOrderData } from '../src/interfaces/orderData.interface';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let ordersRepository: Repository<Orders>;
  let productsRepository: Repository<Products>;
  let usersRepository: Repository<Users>;
  let insertedProductIds: string[] = []; // Guardar los IDs de los productos insertados
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

    ordersRepository = moduleFixture.get<Repository<Orders>>(
      getRepositoryToken(Orders),
    );
    productsRepository = moduleFixture.get<Repository<Products>>(
      getRepositoryToken(Products),
    );
    usersRepository = moduleFixture.get<Repository<Users>>(
      getRepositoryToken(Users),
    );

    // Crear un usuario de prueba
    const user: UserResponseDto = usersRepository.create({
      name: 'Test User',
      email: 'users@example.com',
      password: await bcrypt.hash('password123', 10),
      phone: 123456789,
      country: 'México',
      address: 'Calle 123',
      city: 'CDMX',
      isAdmin: false,
    });

    await usersRepository.save(user); // ✅ Guarda el usuario

    userId = user.id;

    const insertedProducts: ProductResponseDto[] =
      await productsRepository.save([
        {
          name: 'Text1',
          description: 'Text1',
          price: 10.99,
          stock: 10,
          imgUrl: 'Text1',
        },
        {
          name: 'Text2',
          description: 'Text2',
          price: 10.99,
          stock: 10,
          imgUrl: 'Text2',
        },
      ]);

    // Guardamos los IDs de los productos insertados
    insertedProductIds = insertedProducts.map((id) => id.id);

    // Obtener token de autenticación
    const response: request.Response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'users@example.com', password: 'password123' });
    authToken = response.body.token;
  });

  afterAll(async () => {
    try {
      // Elimina productos de la tabla intermedia orderdetails_products
      await ordersRepository.query(
        `DELETE FROM orderdetails_products WHERE orderdetail_id IN 
        (SELECT id FROM orderdetails WHERE order_id IN (SELECT id FROM orders WHERE user_id = $1));`,
        [userId],
      );

      // Elimina detalles de órdenes relacionadas con las pruebas
      await ordersRepository.query(
        `DELETE FROM orderdetails WHERE order_id IN (SELECT id FROM orders WHERE user_id = $1);`,
        [userId],
      );

      // Elimina órdenes creadas por el usuario de prueba
      await ordersRepository.query(`DELETE FROM orders WHERE user_id = $1;`, [
        userId,
      ]);

      // Elimina los productos insertados en la prueba
      if (insertedProductIds.length > 0) {
        await productsRepository.delete(insertedProductIds);
      }

      // Elimina el usuario de prueba
      await usersRepository.delete(userId);
    } catch (error) {
      console.error('Error al limpiar la base de datos:', error);
    } finally {
      await app.close();
    }
  });

  it('Should create an order', async () => {
    const orderData: IOrderData = {
      userId: userId,
      products: [{ id: insertedProductIds[0] }, { id: insertedProductIds[1] }],
    };

    const response: request.Response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${authToken}`) // Enviar el token de autenticación
      .send(orderData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('date');
    expect(response.body).toHaveProperty('orderDetails');
    expect(response.body.orderDetails.products.length).toBeGreaterThanOrEqual(
      2,
    );

    response.body.orderDetails.products.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('stock');
      expect(product).toHaveProperty('imgUrl');
    });
  });

  it('Should throw an Exception if is given wrong information', async () => {
    const orderData: IOrderData = {
      userId: userId,
      products: [
        { id: '11111111-1111-1111-1111-111111111111' },
        { id: '22222222-2222-2222-2222-222222222222' },
      ],
    };

    const response: request.Response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${authToken}`) // Enviar el token de autenticación
      .send(orderData)
      .expect(404); // O el código de error que hayas definido para productos inexistentes

    expect(response.body).toHaveProperty('message');
  });
});
