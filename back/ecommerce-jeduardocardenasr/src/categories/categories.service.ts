import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  addCategoriesService() {
    return this.categoriesRepository.addCategories();
  }

  getCategoriesService() {
    return this.categoriesRepository.getCategories();
  }
}
