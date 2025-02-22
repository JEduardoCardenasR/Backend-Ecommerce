import { Repository } from 'typeorm';
import { CategoriesRepository } from './categories.repository';
import { Categories } from '../entities/categories.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoriesRepository', () => {
  let categoriesRepository: CategoriesRepository;
  let categoriesRepositoryMock: Repository<Categories>;

  const mockCategories: Categories[] = [
    { id: '1', name: 'Celular Genérico', products: [] },
    { id: '2', name: 'Televisor Genérico', products: [] },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesRepository,
        {
          provide: getRepositoryToken(Categories),
          useValue: {
            find: jest.fn().mockResolvedValue(mockCategories),
          },
        },
      ],
    }).compile();

    categoriesRepository =
      module.get<CategoriesRepository>(CategoriesRepository);
    categoriesRepositoryMock = module.get<Repository<Categories>>(
      getRepositoryToken(Categories),
    );
  });

  it('Debe estar definido el CategoriesRepository', () => {
    expect(categoriesRepository).toBeDefined();
  });

  describe('getCategories', () => {
    it('Debe retornar una lista de categorías', async () => {
      jest
        .spyOn(categoriesRepositoryMock, 'find')
        .mockResolvedValue(mockCategories);

      const result = await categoriesRepository.getCategories();

      expect(result).toEqual(mockCategories);
      expect(categoriesRepositoryMock.find).toHaveBeenCalled();
    });

    it('Debe retornar un array vacío si no hay categorías', async () => {
      jest.spyOn(categoriesRepositoryMock, 'find').mockResolvedValue([]);

      const result = await categoriesRepository.getCategories();

      expect(result).toEqual([]);
      expect(categoriesRepositoryMock.find).toHaveBeenCalled();
    });
  });
});
