import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Products } from 'src/entities/products.entity';
import { data } from 'src/utils/Archivo_actividad_3';
import { Repository } from 'typeorm';

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
    const products = await this.productsRepository.find({
      relations: {
        category: true,
      },
    });

    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      products: products.slice(start, end), // Solo devuelve los productos de la página
      totalProducts,
      totalPages,
    };
  }

  async getProductById(id: string): Promise<Products> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no enconrado`);
    }
    return product;
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
}
