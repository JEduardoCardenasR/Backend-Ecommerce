import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../entities/categories.entity';
import { Products } from '../entities/products.entity';
import { InsertResult, MoreThan, Repository } from 'typeorm';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  // UPLOAD PRODUCTS
  async addProductRepository(product: Products): Promise<InsertResult> {
    return await this.productsRepository
      .createQueryBuilder()
      .insert()
      .into(Products)
      .values(product)
      .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name']) // Esto es para actualizar en caso de que ya exista - name es aparte porque es un valor único
      .execute();
  }

  //GET ALL PRODUCTS
  async getProductsRepository(
    skip: number,
    limit: number,
  ): Promise<[Products[], number]> {
    return await this.productsRepository.findAndCount({
      //Find and Count te devuelve los productos (primer valor) y el total de productos (segundo valor)
      where: { stock: MoreThan(0) }, // Solo productos con stock > 0
      relations: { category: true },
      take: limit,
      skip: skip,
    });
  }

  // GET PRODUCT BY ID
  async getProductByIdRepository(id: string): Promise<Products> {
    return await this.productsRepository.findOne({
      where: { id },
      relations: { category: true },
    });
  }

  // GET PRODUCT BY NAME
  async getProductByNameRepository(name: string): Promise<Products> {
    return await this.productsRepository.findOne({
      where: { name },
      relations: { category: true },
    });
  }

  // GET PRODUCT BY CATEGORY
  async getProductByCategoryRepository(category: string): Promise<Products> {
    return await this.productsRepository.findOne({
      where: { category: { name: category } }, // Busca por el nombre dentro de category
      relations: ['category'], // Asegura que se cargue la relación con category
    });
  }

  // UPDATE PRODUCT BY ID
  async updateProductRepository(id: string, product: Partial<Products>) {
    await this.productsRepository.update(id, product);
  }

  // DELETE PRODUCT BY ID
  async deleteProductRepository(id: string) {
    await this.productsRepository.delete(id);
  }
}
