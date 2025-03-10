import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { NotFoundException } from '@nestjs/common';
import { ProductResponseDto } from '../dtos/productsDtos/product-response.dto';
import { CategoriesRepository } from '../categories/categories.repository';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepositoryMock: Partial<ProductsRepository>;
  let categoriesRepositoryMock: Partial<CategoriesRepository>;

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

  const mockGetProductById: (
    id: string,
  ) => Promise<ProductResponseDto | NotFoundException> = (id: string) => {
    if (id !== '1') {
      return Promise.reject(
        new NotFoundException(`Product with id ${id} was not found`),
      );
    }
    return Promise.resolve(mockProduct);
  };

  beforeEach(async () => {
    productsRepositoryMock = {
      getProductByIdRepository: jest
        .fn()
        .mockImplementation(mockGetProductById),
    };

    categoriesRepositoryMock = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: productsRepositoryMock,
        },
        {
          provide: CategoriesRepository,
          useValue: categoriesRepositoryMock,
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    productsRepositoryMock = module.get<ProductsRepository>(ProductsRepository);
    categoriesRepositoryMock =
      module.get<CategoriesRepository>(CategoriesRepository);
  });

  it('Service should be defined', () => {
    expect(productsService).toBeDefined();
  });

  describe('getProductByIdService', () => {
    it('Should return a product', async () => {
      const userId: string = '1';
      const result: ProductResponseDto =
        await productsService.getProductByIdService(userId);
      expect(result).toEqual(mockProduct);
      expect(
        productsRepositoryMock.getProductByIdRepository,
      ).toHaveBeenCalledWith(userId);
    });

    it('Should throw a NotFoundException if product ID does not exist', async () => {
      const nonExistentUserId: string = '2';
      await expect(
        productsService.getProductByIdService(nonExistentUserId),
      ).rejects.toThrow(
        new NotFoundException(
          `Product with id ${nonExistentUserId} was not found`,
        ),
      );

      expect(
        productsRepositoryMock.getProductByIdRepository,
      ).toHaveBeenCalledWith(nonExistentUserId);
    });
  });
});
