import { Test, TestingModule } from '@nestjs/testing';
import { Repository, UpdateResult } from 'typeorm';
import { Products } from '../entities/products.entity';
import { ProductsRepository } from './products.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductResponseDto } from '../dtos/productsDtos/product-response.dto';

describe('ProductsRepository', () => {
  let productsRepository: ProductsRepository;
  let productsRepositoryMock: Repository<Products>;

  const mockProduct: ProductResponseDto = {
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
            findOne: jest.fn().mockResolvedValue(mockProduct),
            update: jest
              .fn()
              .mockResolvedValue({ affected: 1 } as UpdateResult), // Simula el retorno de TypeORM en update
          },
        },
      ],
    }).compile();

    productsRepository = module.get<ProductsRepository>(ProductsRepository);
    productsRepositoryMock = module.get<Repository<Products>>(
      getRepositoryToken(Products),
    );
  });

  it('Repository should be defined', () => {
    expect(productsRepository).toBeDefined();
  });

  describe('getProductById', () => {
    it('Should return a product if the ID exists', async () => {
      jest
        .spyOn(productsRepositoryMock, 'findOne')
        .mockImplementation(async (options) => {
          const id: string =
            'where' in options ? (options.where as { id: string }).id : null;
          return id === '1' ? mockProduct : null;
        });

      const result: ProductResponseDto =
        await productsRepository.getProductByIdRepository('1');

      expect(result).toEqual(mockProduct);
      expect(productsRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: { category: true },
      });
    });

    it('Should return null if the product does not exist', async () => {
      jest
        .spyOn(productsRepositoryMock, 'findOne')
        .mockImplementation(async (options) => {
          const id: string =
            'where' in options ? (options.where as { id: string }).id : null;
          return id === '1' ? mockProduct : null;
        });

      const result: ProductResponseDto =
        await productsRepository.getProductByIdRepository('2'); // ID inexistente
      expect(result).toBeNull();
      expect(productsRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: '2' },
        relations: { category: true },
      });
    });
  });

  describe('updateProduct', () => {
    it('Should update a product', async () => {
      jest
        .spyOn(productsRepositoryMock, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult);

      await productsRepository.updateProductRepository('1', {
        name: 'Product updated',
      });
      expect(productsRepositoryMock.update).toHaveBeenCalledWith('1', {
        name: 'Product updated',
      });
    });
  });
});
