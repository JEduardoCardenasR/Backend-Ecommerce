import { Injectable } from '@nestjs/common';
import { Products } from 'src/interfaces/products.interface';

@Injectable()
export class ProductsRepository {
  private products: Products[] = [
    {
      id: 1,
      name: 'Pan',
      description: 'Pan',
      price: 123,
      stock: true,
      imgUrl: 'string',
    },
    {
      id: 2,
      name: 'Cake',
      description: 'Cake',
      price: 123,
      stock: true,
      imgUrl: 'string',
    },
    {
      id: 3,
      name: 'Donut',
      description: 'Donut',
      price: 123,
      stock: true,
      imgUrl: 'string',
    },
  ];

  getProducts(): Products[] {
    return this.products;
  }
}
