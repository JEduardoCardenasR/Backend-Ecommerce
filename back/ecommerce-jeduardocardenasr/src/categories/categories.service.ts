import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { data } from '../utils/Archivo_actividad_3';
import { CategoryResponseDto } from '../dtos/categoriesDtos/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  // UPLOAD PRODUCTS
  async addCategoriesService(): Promise<string> {
    for (const element of data) {
      await this.categoriesRepository.addCategoriesRepository(element);
    }
    return 'Categories successfully added';
  }

  //GET ALL CATEGORIES
  async getCategoriesService(): Promise<CategoryResponseDto[]> {
    const categories: CategoryResponseDto[] =
      await this.categoriesRepository.getCategoriesRepository();

    if (!categories || categories.length === 0) {
      throw new NotFoundException('No categories found');
    }

    return categories;
  }
}
