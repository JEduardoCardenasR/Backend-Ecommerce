import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getCategoriesRepository() {
    return await this.categoriesRepository.find();
  }

  async addCategoriesRepository(element) {
    return await this.categoriesRepository
      .createQueryBuilder()
      .insert()
      .into(Categories)
      .values({ name: element.category })
      .orIgnore()
      .execute();
  }

  async getCategoryByNameRepository(name: string) {
    return await this.categoriesRepository.findOneBy({ name });
  }

  async getCategoryByIdRepository(id: string) {
    return await this.categoriesRepository.findOneBy({ id });
  }
}
