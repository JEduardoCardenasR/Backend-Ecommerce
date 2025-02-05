import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async onModuleInit() {
    await this.addCategories(); //Carga automática de las categorías
  }

  addCategories() {
    return this.categoriesRepository.addCategories();
  }

  getCategories() {
    return this.categoriesRepository.getCategories();
  }
}
