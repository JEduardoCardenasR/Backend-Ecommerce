import { Injectable } from '@nestjs/common';
import { Product } from './products.entity';

@Injectable()
export class ProductsRepository {
  private products: Product[] = [
    {
      id: 1,
      name: 'Pan',
      description: 'Pan bueno',
      price: 123,
      stock: true,
      imgUrl: 'string',
    },
    {
      id: 2,
      name: 'Cake',
      description: 'Cake bueno',
      price: 123,
      stock: true,
      imgUrl: 'string',
    },
    {
      id: 3,
      name: 'Donut',
      description: 'Donut bueno',
      price: 123,
      stock: true,
      imgUrl: 'string',
    },
  ];

  getProducts(): Product[] {
    return this.products;
  }
}
