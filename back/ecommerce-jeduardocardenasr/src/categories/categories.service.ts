import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { data } from '../utils/Archivo_actividad_3';
import { CategoryResponseDto } from 'src/dtos/categoriesDtos/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async addCategoriesService(): Promise<string> {
    for (const element of data) {
      await this.categoriesRepository.addCategoriesRepository(element);
    }
    return 'Categories successfully added';
  }

  getCategoriesService(): Promise<CategoryResponseDto[]> {
    return this.categoriesRepository.getCategoriesRepository();
  }
}
