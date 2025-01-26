import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from 'src/interfaces/products.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProductsController(): Products[] {
    return this.productsService.getProductsService();
  }
}
