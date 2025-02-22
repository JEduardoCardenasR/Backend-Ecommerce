import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { NotFoundException } from '@nestjs/common';
import { Products } from '../entities/products.entity';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepositoryMock: Partial<ProductsRepository>;

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
    productsRepositoryMock = {
      getProductById: jest.fn(),
      getProducts: jest.fn(),
      updateProduct: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: productsRepositoryMock,
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
  });

  it('Debe estar definido', () => {
    expect(productsService).toBeDefined();
  });

  describe('getProductByIdService', () => {
    it('Debe retornar un producto si existe', async () => {
      jest
        .spyOn(productsRepositoryMock, 'getProductById')
        .mockResolvedValue(mockProduct);

      const result = await productsService.getProductByIdService('1');
      expect(result).toEqual(mockProduct);
      expect(productsRepositoryMock.getProductById).toHaveBeenCalledWith('1'); // Verificar que se llamó con el ID correcto
    });

    it('Debe lanzar NotFoundException si el producto no existe', async () => {
      jest
        .spyOn(productsRepositoryMock, 'getProductById')
        .mockResolvedValue(null);

      await expect(
        productsService.getProductByIdService('9999'),
      ).rejects.toThrow(
        new NotFoundException('Producto con id 9999 no enconrado'),
      );

      expect(productsRepositoryMock.getProductById).toHaveBeenCalledWith(
        '9999',
      ); // Verificar que se llamó con el ID correcto
    });
  });
});
