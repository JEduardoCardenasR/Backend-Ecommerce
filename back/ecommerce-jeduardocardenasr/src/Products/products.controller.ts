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
import { validateProduct } from '../utils/products.validate';
import { Products } from '../entities/products.entity';
import { Rol } from '../enums/roles.enum';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../Auth/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProductDto } from 'src/dtos/productsDtos/update-product.dto';
import { CreateProductDto } from 'src/dtos/productsDtos/product.dto';
import { ProductResponseDto } from 'src/dtos/productsDtos/product.response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('seeder')
  @ApiOperation({ summary: 'Populate database with sample products' })
  @ApiResponse({ status: 201, description: 'Products added successfully' })
  @ApiResponse({ status: 500, description: 'Error while adding products' })
  addProductsController(): Promise<string> {
    return this.productsService.addProductsService();
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOperation({ summary: 'Retrieve all products with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of products successfully retrieved',
  })
  @ApiResponse({ status: 400, description: 'Invalid pagination parameters' })
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

  @Post()
  @ApiBearerAuth()
  @ApiSecurity('roles')
  @Roles(Rol.Administrator)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid product data' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can create products',
  })
  @ApiBody({
    description: 'Product data to create',
    type: CreateProductDto,
    required: true,
  })
  createProductController(
    @Body() newProduct: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.createProductService(newProduct);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductByIdController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductResponseDto> {
    return await this.productsService.getProductByIdService(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiSecurity('roles')
  @Roles(Rol.Administrator)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid product data' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can update products',
  })
  @ApiBody({
    description: 'Product data to update',
    type: UpdateProductDto,
    required: true,
  })
  async updateProductController(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedProduct: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.updateProductService(id, updatedProduct);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiSecurity('roles')
  @Roles(Rol.Administrator) // Solo los administradores pueden eliminar productos
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a product by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can delete products',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid product ID' })
  deleteProductController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductResponseDto> {
    return this.productsService.deleteProductService(id);
  }
}
