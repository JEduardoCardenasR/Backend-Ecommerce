import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../entities/categories.entity';
import { InsertResult, Repository } from 'typeorm';
import { Products } from 'src/entities/products.entity';
import { CategoryResponseDto } from 'src/dtos/categoriesDtos/category-response.dto';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async addCategoriesRepository(element: {
    category: string;
  }): Promise<InsertResult> {
    return await this.categoriesRepository
      .createQueryBuilder()
      .insert()
      .into(Categories)
      .values({ name: element.category })
      .orIgnore()
      .execute();
  }

  async getCategoriesRepository(): Promise<Categories[]> {
    return await this.categoriesRepository.find();
  }

  async getCategoryByNameRepository(name: string): Promise<Categories> {
    return await this.categoriesRepository.findOneBy({ name });
  }

  async getCategoryByIdRepository(id: string): Promise<Categories> {
    return await this.categoriesRepository.findOneBy({ id });
  }

  async deleteCategoryByIdRepository(id: string) {
    await this.categoriesRepository.delete(id);
  }
}
