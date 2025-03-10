import { Repository } from 'typeorm';
import { CategoriesRepository } from './categories.repository';
import { Categories } from '../entities/categories.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryResponseDto } from '../dtos/categoriesDtos/category-response.dto';

describe('CategoriesRepository', () => {
  let categoriesRepository: CategoriesRepository;
  let categoriesRepositoryMock: Repository<Categories>;

  let mockCategories: CategoryResponseDto[] = [
    { id: '1', name: 'Generic Phone', products: [] },
    { id: '2', name: 'Generic TV', products: [] },
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

  it('Repository should be defined', () => {
    expect(categoriesRepository).toBeDefined();
  });

  describe('getCategories', () => {
    it('Should return a list of categories', async () => {
      jest
        .spyOn(categoriesRepositoryMock, 'find')
        .mockResolvedValue(mockCategories);

      const result: CategoryResponseDto[] =
        await categoriesRepository.getCategoriesRepository();

      expect(result).toEqual(mockCategories);
      expect(categoriesRepositoryMock.find).toHaveBeenCalled();
    });

    it('Should return an empty array if there are no categories', async () => {
      mockCategories = [];

      jest
        .spyOn(categoriesRepositoryMock, 'find')
        .mockResolvedValue(mockCategories);

      const result: CategoryResponseDto[] =
        await categoriesRepository.getCategoriesRepository();

      expect(result).toEqual([]);
      expect(categoriesRepositoryMock.find).toHaveBeenCalled();
    });
  });
});
