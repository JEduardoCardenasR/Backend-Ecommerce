import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../Auth/guards/auth.guard';
import { Rol } from '../enums/roles.enum';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../Auth/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProductDto } from '../dtos/productsDtos/update-product.dto';
import { CreateProductDto } from '../dtos/productsDtos/product.dto';
import { ProductResponseDto } from '../dtos/productsDtos/product-response.dto';

@ApiTags('Products')
@ApiResponse({
  status: 500,
  description: 'Internal server error. Please try again later.',
})
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // UPLOAD PRODUCTS
  @Get('seeder')
  @ApiOperation({ summary: 'Populate database with sample products' })
  @ApiResponse({ status: 201, description: 'Products added successfully' })
  addProductsController(): Promise<string> {
    return this.productsService.addProductsService();
  }

  //GET ALL PRODUCTS
  @Get()
  @ApiOperation({ summary: 'Retrieve all products with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination (default is 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default is 5)',
    type: Number,
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'List of products successfully retrieved',
  })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data format' })
  @ApiResponse({ status: 404, description: 'No products found' })
  async getProductsController(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{
    products: ProductResponseDto[];
    totalPages: number;
    totalProducts: number;
  }> {
    const pageNumber: number =
      page && !isNaN(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const limitNumber: number =
      limit && !isNaN(Number(limit)) && Number(limit) > 0 ? Number(limit) : 5;

    return await this.productsService.getProductsService(
      pageNumber,
      limitNumber,
    );
  }

  // CREATE PRODUCTS
  @Post()
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiBody({
    description: 'Product data to create',
    type: CreateProductDto,
    required: true,
  })
  @ApiBearerAuth()
  @Roles(Rol.Administrator)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data format' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can create products',
  })
  @ApiResponse({ status: 409, description: 'Product name already exist' })
  createProductController(
    @Body() newProduct: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.createProductService(newProduct);
  }

  // GET PRODUCT BY ID
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a product by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID (UUID format)',
    example: '087513fe-0e35-4ab3-a5da-e367ec122074',
  })
  @ApiResponse({ status: 200, description: 'Product found successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data format' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductByIdController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductResponseDto> {
    return await this.productsService.getProductByIdService(id);
  }

  // UPDATE PRODUCT BY ID
  @Put(':id')
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID (UUID format)',
    example: '087513fe-0e35-4ab3-a5da-e367ec122074',
  })
  @ApiBody({
    description: 'Product data to update',
    type: UpdateProductDto,
    required: true,
  })
  @ApiBearerAuth()
  @Roles(Rol.Administrator)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data format' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can update products',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Product name already exist' })
  async updateProductController(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedProduct: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.updateProductService(id, updatedProduct);
  }

  // DELETE PRODUCT BY ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID (UUID format)',
    example: '087513fe-0e35-4ab3-a5da-e367ec122074',
  })
  @ApiBearerAuth()
  @Roles(Rol.Administrator)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid data format' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can delete products',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  deleteProductController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductResponseDto> {
    return this.productsService.deleteProductService(id);
  }
}
