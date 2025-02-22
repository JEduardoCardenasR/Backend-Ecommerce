import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../entities/categories.entity';
import { Products } from '../entities/products.entity';
import { data } from '../utils/Archivo_actividad_3';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getProducts(
    page: number,
    limit: number,
  ): Promise<{
    products: Products[];
    totalPages: number;
    totalProducts: number;
  }> {
    const [products, totalProducts] =
      await this.productsRepository.findAndCount({
        //Find and Count te devuelve los productos (primer valor) y el total de productos (segundo valor)
        where: { stock: MoreThan(0) }, // Solo productos con stock > 0
        relations: { category: true },
        take: limit,
        skip: (page - 1) * limit,
      });

    const totalPages = Math.ceil(totalProducts / limit);

    return { products, totalProducts, totalPages };
  }

  async getProductById(id: string): Promise<Products> {
    return await this.productsRepository.findOneBy({ id });
  }

  async updateProduct(
    id: string,
    product: Partial<Products>,
  ): Promise<Products> {
    await this.productsRepository.update(id, product);
    const updatedProduct = await this.productsRepository.findOneBy({ id });
    return updatedProduct;
  }

  async addProduct() {
    const categories = await this.categoriesRepository.find(); // Asegura que se obtienen las categorías

    for (const element of data) {
      const category = categories.find((cat) => cat.name === element.category);

      const product = new Products();
      product.name = element.name;
      product.description = element.description;
      product.price = element.price;
      product.imgUrl = element.imgUrl;
      product.stock = element.stock;
      product.category = category; // Se asigna correctamente

      await this.productsRepository
        .createQueryBuilder()
        .insert()
        .into(Products)
        .values(product)
        .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name']) //name es aparte porque es un valor único
        .execute();
    }

    return 'Productos agregados';
  }
}
// createProduct(newProduct: Omit<Products, 'id'>): Products {
//   const idNumber = this.products.length + 1;
//   const id = idNumber.toString();
//   this.products.push({ id, ...newProduct });
//   return { id, ...newProduct };
// }

// deleteProduct(id: string): Products {
//   const index = this.products.findIndex((product) => product.id === id);
//   const deletedProduct = this.products[index];
//   this.products.splice(index, 1);
//   return deletedProduct;
// }
