import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Products } from 'src/entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  getProductsService(
    page: number,
    limit: number,
  ): { products: Products[]; totalPages: number; totalProducts: number } {
    return this.productsRepository.getProducts(page, limit);
  }

  getProductByIdService(id: string): Products {
    return this.productsRepository.getProductById(id);
  }

  createProductService(newProduct: Products): Products {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...filteredData } = newProduct; //Eliminamos el id
    return this.productsRepository.createProduct(filteredData);
  }

  updateProductService(
    id: string,
    updatedProduct: Partial<Products>,
  ): Products {
    return this.productsRepository.updateProduct(id, updatedProduct);
  }

  deleteProductService(id: string): Products {
    return this.productsRepository.deleteProduct(id);
  }
}
