import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Repository } from 'typeorm';
import { data } from '../utils/Archivo_actividad_3.js';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getCategories() {
    return await this.categoriesRepository.find();
  }

  async addCategories() {
    data?.map(async (element) => {
      await this.categoriesRepository

        .createQueryBuilder()
        .insert()
        .into(Categories)
        .values({ name: element.category })
        .orIgnore()
        .execute();
    });
    return 'Categorías agregadas';
  }
}
