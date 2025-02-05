import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private cateforiesService: CategoriesService) {}

  @Get('seeder')
  addCategories() {
    return this.cateforiesService.addCategories();
  }

  @Get()
  getCategories() {
    return this.cateforiesService.getCategories();
  }
}
