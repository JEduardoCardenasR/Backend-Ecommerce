import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './products.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProductsController(): Product[] {
    return this.productsService.getProductsService();
  }

  @Get(':id')
  getProductByIdController(@Param('id') id: string): Product {
    return this.productsService.getProductByIdService(id);
  }

  @Post()
  createProductController(@Body() newProduct: Product): Product {
    return this.productsService.createProductService(newProduct);
  }

  @Put(':id')
  updateProductController(
    @Param('id') id: string,
    @Body() updatedProduct: Partial<Product>,
  ): Product {
    return this.productsService.updateProductService(id, updatedProduct);
  }

  @Delete(':id')
  deleteProductController(@Param('id') id: string): Product {
    return this.productsService.deleteProductService(id);
  }
}
