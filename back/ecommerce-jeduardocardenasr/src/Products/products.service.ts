import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  getProductsService(
    page: number,
    limit: number,
  ): { products: Product[]; totalPages: number; totalProducts: number } {
    return this.productsRepository.getProducts(page, limit);
  }

  getProductByIdService(id: string): Product {
    return this.productsRepository.getProductById(id);
  }

  createProductService(newProduct: Product): Product {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...filteredData } = newProduct; //Eliminamos el id
    return this.productsRepository.createProduct(filteredData);
  }

  updateProductService(id: string, updatedProduct: Partial<Product>): Product {
    return this.productsRepository.updateProduct(id, updatedProduct);
  }

  deleteProductService(id: string): Product {
    return this.productsRepository.deleteProduct(id);
  }
}
