import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get('seeder')
  addCategoriesController() {
    return this.categoriesService.addCategoriesService();
  }

  @Get()
  getCategoriesController() {
    return this.categoriesService.getCategoriesService();
  }
}
