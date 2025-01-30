import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Products } from 'src/interfaces/products.interface';
import { Product } from './products.entity';
import { filter } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  getProductsService(): Products[] {
    return this.productsRepository.getProducts();
  }

  getProductByIdService(id: string): Product {
    return this.productsRepository.getProductById(id);
  }

  createProductService(newProduct: Product): Product {
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
