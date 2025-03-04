import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { data } from '../utils/Archivo_actividad_3';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  getCategoriesService() {
    return this.categoriesRepository.getCategoriesRepository();
  }

  async addCategoriesService() {
    for (const element of data) {
      await this.categoriesRepository.addCategoriesRepository(element);
    }
    return 'Categorías agregadas';
  }
}
