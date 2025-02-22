import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Products } from '../entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async getProductsService(
    page: number,
    limit: number,
  ): Promise<{
    products: Products[];
    totalPages: number;
    totalProducts: number;
  }> {
    // await this.addProductsService(); //Carga previa de los productos
    return await this.productsRepository.getProducts(page, limit);
  }

  async getProductByIdService(id: string): Promise<Products> {
    const product = await this.productsRepository.getProductById(id);

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no enconrado`);
    }

    return product;
  }

  addProductsService() {
    return this.productsRepository.addProduct();
  }

  async updateProductService(
    id: string,
    updatedProduct: Partial<Products>,
  ): Promise<Products> {
    return await this.productsRepository.updateProduct(id, updatedProduct);
  }
}
// createProductService(newProduct: Products): Products {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { id, ...filteredData } = newProduct; //Eliminamos el id
//   return this.productsRepository.createProduct(filteredData);
// }

// deleteProductService(id: string): Products {
//   return this.productsRepository.deleteProduct(id);
// }
