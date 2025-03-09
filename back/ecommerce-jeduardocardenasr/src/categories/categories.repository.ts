import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../entities/categories.entity';
import { InsertResult, Repository } from 'typeorm';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  // UPLOAD PRODUCTS
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

  //GET ALL CATEGORIES
  async getCategoriesRepository(): Promise<Categories[]> {
    return await this.categoriesRepository.find();
  }

  //GET CATEGORY BY ID
  async getCategoryByIdRepository(id: string): Promise<Categories> {
    return await this.categoriesRepository.findOneBy({ id });
  }

  //GET CATEGORY BY NAME
  async getCategoryByNameRepository(name: string): Promise<Categories> {
    return await this.categoriesRepository.findOneBy({ name });
  }

  //DELETE CATEGORY BY ID
  async deleteCategoryByIdRepository(id: string) {
    await this.categoriesRepository.delete(id);
  }
}
