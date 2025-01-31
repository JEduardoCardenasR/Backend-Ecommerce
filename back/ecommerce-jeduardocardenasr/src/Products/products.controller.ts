import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './products.entity';
import { AuthGuard } from 'src/Auth/auth-guard.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProductsController(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): { products: Product[]; totalPages: number; totalProducts: number } {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 5;

    return this.productsService.getProductsService(pageNumber, limitNumber);
  }

  @Get(':id')
  getProductByIdController(@Param('id') id: string): Product {
    return this.productsService.getProductByIdService(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  createProductController(@Body() newProduct: Product): Product {
    return this.productsService.createProductService(newProduct);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateProductController(
    @Param('id') id: string,
    @Body() updatedProduct: Partial<Product>,
  ): Product {
    return this.productsService.updateProductService(id, updatedProduct);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteProductController(@Param('id') id: string): Product {
    return this.productsService.deleteProductService(id);
  }
}
