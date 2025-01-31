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
    {
      id: 4,
      name: 'Churro',
      description: 'Churro bueno',
      price: 123,
      stock: true,
      imgUrl: 'string',
    },
    {
      id: 5,
      name: 'Cookie',
      description: 'Cookie bueno',
      price: 123,
      stock: true,
      imgUrl: 'string',
    },
    {
      id: 6,
      name: 'Concha',
      description: 'Concha bueno',
      price: 123,
      stock: true,
      imgUrl: 'string',
    },
  ];

  getProducts(
    page: number,
    limit: number,
  ): { products: Product[]; totalPages: number; totalProducts: number } {
    const totalProducts = this.products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      products: this.products.slice(start, end), // Solo devuelve los productos de la página
      totalProducts,
      totalPages,
    };
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
