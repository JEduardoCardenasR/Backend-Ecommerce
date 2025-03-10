import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategoriesService } from './categories/categories.service';
import { ProductsService } from './products/products.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
  ) {}

  async onModuleInit() {
    await this.categoriesService.addCategoriesService(); //Carga automática de las categorías cuando se incia el servidor.
    await this.productsService.addProductsService(); //Carga automática de los productos cuando se incia el servidor.
  }

  getHello(): string {
    return 'Welcome to Eduardo´s Ecommerce';
  }
}
