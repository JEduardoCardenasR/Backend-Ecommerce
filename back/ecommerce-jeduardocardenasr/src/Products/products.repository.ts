import { Injectable } from '@nestjs/common';
import { Products } from 'src/entities/products.entity';

@Injectable()
export class ProductsRepository {
  private products: Products[] = [];

  getProducts(
    page: number,
    limit: number,
  ): { products: Products[]; totalPages: number; totalProducts: number } {
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

  getProductById(id: string): Products {
    return this.products.find((product) => product.id === id);
  }

  createProduct(newProduct: Omit<Products, 'id'>): Products {
    const idNumber = this.products.length + 1;
    const id = idNumber.toString();
    this.products.push({ id, ...newProduct });
    return { id, ...newProduct };
  }

  updateProduct(id: string, updatedProduct: Partial<Products>): Products {
    const index = this.products.findIndex((product) => product.id === id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...filterData } = updatedProduct;
    this.products[index] = { ...this.products[index], ...filterData };
    return this.products[index];
  }

  deleteProduct(id: string): Products {
    const index = this.products.findIndex((product) => product.id === id);
    const deletedProduct = this.products[index];
    this.products.splice(index, 1);
    return deletedProduct;
  }
}
