import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../entities/categories.entity';
import { Products } from '../entities/products.entity';
import { MoreThan, Repository } from 'typeorm';
import { UpdateProductDto } from 'src/dtos/update-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getProductsRepository(
    page: number,
    limit: number,
  ): Promise<[Products[], number]> {
    return await this.productsRepository.findAndCount({
      //Find and Count te devuelve los productos (primer valor) y el total de productos (segundo valor)
      where: { stock: MoreThan(0) }, // Solo productos con stock > 0
      relations: { category: true },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async getProductByIdRepository(id: string): Promise<Products> {
    return await this.productsRepository.findOne({
      where: { id },
      relations: { category: true },
    });
  }

  async findCategoriesInProductsRepository() {
    return await this.categoriesRepository.find(); // Asegura que se obtienen las categorías
  }

  async addProductRepository(product) {
    return await this.productsRepository
      .createQueryBuilder()
      .insert()
      .into(Products)
      .values(product)
      .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name']) //name es aparte porque es un valor único
      .execute();
  }

  async updateProductRepository(id: string, product: UpdateProductDto) {
    await this.productsRepository.update(id, product);
  }

  async deleteProductRepository(id: string) {
    await this.productsRepository.delete(id);
  }
}
