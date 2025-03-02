import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get('seeder')
  @ApiOperation({ summary: 'Add initial categories to the database' })
  @ApiResponse({ status: 201, description: 'Categories added successfully' })
  @ApiResponse({ status: 500, description: 'Error while adding categories' })
  addCategoriesController() {
    return this.categoriesService.addCategoriesService();
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of categories retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'No categories found' })
  getCategoriesController() {
    return this.categoriesService.getCategoriesService();
  }
}
