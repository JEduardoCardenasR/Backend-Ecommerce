import { Test, TestingModule } from '@nestjs/testing';
import { Repository, UpdateResult } from 'typeorm';
import { Products } from '../entities/products.entity';
import { ProductsRepository } from './products.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Categories } from '../entities/categories.entity';

describe('ProductsRepository', () => {
  let productsRepository: ProductsRepository;
  let productsRepositoryMock: Repository<Products>;

  const mockProduct: Products = {
    id: '1',
    name: 'Laptop Gamer',
    description: 'Laptop con RTX 3070',
    price: 1500.99,
    stock: 5,
    imgUrl: 'laptop.jpg',
    category: null,
    orderDetails: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsRepository,
        {
          provide: getRepositoryToken(Products),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockProduct),
            update: jest
              .fn()
              .mockResolvedValue({ affected: 1 } as UpdateResult), // Simulando el retorno de TypeORM
          },
        },
        {
          provide: getRepositoryToken(Categories),
          useValue: {
            findOneBy: jest.fn(), // Simulación de un método del repositorio de Categories
          },
        },
      ],
    }).compile();

    productsRepository = module.get<ProductsRepository>(ProductsRepository);
    productsRepositoryMock = module.get<Repository<Products>>(
      getRepositoryToken(Products),
    );
  });

  it('Debe estar definido el ProductsRepository', () => {
    expect(productsRepository).toBeDefined();
  });

  describe('getProductById', () => {
    it('Debe retornar un producto si el ID existe', async () => {
      jest
        .spyOn(productsRepositoryMock, 'findOneBy')
        .mockResolvedValue(mockProduct);

      const result = await productsRepository.getProductById('1');

      expect(result).toEqual(mockProduct);
      expect(productsRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: '1',
      });
    });

    it('Debe retornar null si el producto no existe', async () => {
      jest.spyOn(productsRepositoryMock, 'findOneBy').mockResolvedValue(null);

      const result = await productsRepository.getProductById('9999');
      expect(result).toBeNull();
      expect(productsRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: '9999',
      });
    });
  });

  describe('updateProduct', () => {
    it('Debe actualizar y devolver el producto actualizado', async () => {
      jest.spyOn(productsRepositoryMock, 'update').mockResolvedValue(undefined);
      jest
        .spyOn(productsRepositoryMock, 'findOneBy')
        .mockResolvedValue(mockProduct);

      const result = await productsRepository.updateProduct('1', {
        name: 'Producto Actualizado',
      });
      expect(result).toEqual(mockProduct);
      expect(productsRepositoryMock.update).toHaveBeenCalledWith(
        '1', // Filtro para encontrar el producto
        { name: 'Producto Actualizado' }, // Datos a actualizar
      );
      expect(productsRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: '1',
      });
    });
  });
});
