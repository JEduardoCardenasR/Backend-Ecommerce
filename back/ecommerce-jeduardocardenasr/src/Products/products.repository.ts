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

  getProductById(id: string): Product {
    return this.products.find((product) => product.id === Number(id));
  }

  createProduct(newProduct: Omit<Product, 'id'>): Product {
    const id = this.products.length + 1;
    this.products.push({ id, ...newProduct });
    return { id, ...newProduct };
  }

  updateProduct(id: string, updatedProduct: Partial<Product>): Product {
    const index = this.products.findIndex(
      (product) => product.id === Number(id),
    );
    const { id: _, ...filterData } = updatedProduct;
    this.products[index] = { ...this.products[index], ...filterData };
    return this.products[index];
  }

  deleteProduct(id: string): Product {
    const index = this.products.findIndex(
      (product) => product.id === Number(id),
    );
    const deletedProduct = this.products[index];
    this.products.splice(index, 1);
    return deletedProduct;
  }
}
