import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryResponseDto } from '../dtos/categoriesDtos/category-response.dto';

@ApiTags('Categories')
@ApiResponse({
  status: 500,
  description: 'Internal server error. Please try again later.',
})
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  // UPLOAD PRODUCTS
  @Get('seeder')
  @ApiOperation({ summary: 'Add initial categories to the database' })
  @ApiResponse({ status: 201, description: 'Categories added successfully' })
  addCategoriesController(): Promise<string> {
    return this.categoriesService.addCategoriesService();
  }

  //GET ALL CATEGORIES
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of categories retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'No categories found' })
  getCategoriesController(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.getCategoriesService();
  }
}
