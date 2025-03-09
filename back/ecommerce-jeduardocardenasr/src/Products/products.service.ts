import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Products } from '../entities/products.entity';
import { UpdateProductDto } from '../dtos/productsDtos/update-product.dto';
import { data } from '../utils/Archivo_actividad_3';
import { CategoriesRepository } from '../categories/categories.repository';
import { ProductResponseDto } from '../dtos/productsDtos/product-response.dto';
import { CategoryResponseDto } from '../dtos/categoriesDtos/category-response.dto';
import { CreateProductDto } from '../dtos/productsDtos/product.dto';
import { InsertResult } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  // UPLOAD PRODUCTS
  async addProductsService(): Promise<string> {
    const categories: CategoryResponseDto[] =
      await this.categoriesRepository.getCategoriesRepository();

    // Verificar duplicados dentro del array data
    const productNames: Set<string> = new Set();
    for (const element of data) {
      if (productNames.has(element.name)) {
        throw new BadRequestException(
          `You are trying to add two or more products with the name '${element.name}' within the same request. Names must be unique.`,
        );
      }
      productNames.add(element.name);
    }

    for (const element of data) {
      const category: CategoryResponseDto = categories.find(
        (cat) => cat.name === element.category,
      );

      // Verificar duplicados en la base de datos
      const foundName: ProductResponseDto =
        await this.productsRepository.getProductByNameRepository(element.name);
      if (foundName) {
        throw new BadRequestException(
          `You are trying to add two or more products with the name '${element.name}'. Names of products must be unique.`,
        );
      }

      const product = new Products();
      product.name = element.name;
      product.description = element.description;
      product.price = element.price;
      product.imgUrl = element.imgUrl;
      product.stock = element.stock;
      product.category = category;

      this.productsRepository.addProductRepository(product);
    }
    return 'Products successfully added';
  }

  //GET ALL PRODUCTS
  async getProductsService(
    page: number,
    limit: number,
  ): Promise<{
    products: ProductResponseDto[];
    totalPages: number;
    totalProducts: number;
  }> {
    const skip: number = (page - 1) * limit;

    const [products, totalProducts]: [ProductResponseDto[], number] =
      await this.productsRepository.getProductsRepository(skip, limit);

    if (!products || products.length === 0) {
      throw new NotFoundException('No products found');
    }

    const totalPages: number = Math.ceil(totalProducts / limit);

    return { products, totalPages, totalProducts };
  }

  // CREATE PRODUCTS
  async createProductService(
    newProduct: CreateProductDto,
  ): Promise<ProductResponseDto> {
    if (!newProduct.category) {
      throw new BadRequestException(`Property category must be added`);
    }

    let newCategory: CategoryResponseDto =
      await this.categoriesRepository.getCategoryByNameRepository(
        newProduct.category,
      );

    if (!newCategory) {
      const addedCategory: InsertResult =
        await this.categoriesRepository.addCategoriesRepository(newProduct);

      if (
        !addedCategory.identifiers ||
        addedCategory.identifiers.length === 0
      ) {
        throw new BadRequestException(`Category has not been created`);
      }

      const addedCategoryId: string = addedCategory.identifiers[0].id;
      newCategory =
        await this.categoriesRepository.getCategoryByIdRepository(
          addedCategoryId,
        );
    }
    const productWithCategory = new Products();
    const foundName: ProductResponseDto =
      await this.productsRepository.getProductByNameRepository(newProduct.name);
    if (foundName) throw new ConflictException(`Product name already exist`);
    productWithCategory.name = newProduct.name;
    productWithCategory.description = newProduct.description;
    productWithCategory.price = newProduct.price;
    productWithCategory.imgUrl = newProduct.imgUrl;
    productWithCategory.stock = newProduct.stock;
    productWithCategory.category = newCategory;

    const addedProduct: InsertResult =
      await this.productsRepository.addProductRepository(productWithCategory);

    if (!addedProduct.identifiers || addedProduct.identifiers.length === 0) {
      throw new BadRequestException(`Product has not been created`);
    }

    const addedProductId: string = addedProduct.identifiers[0].id;
    const savedProduct: ProductResponseDto =
      await this.productsRepository.getProductByIdRepository(addedProductId);

    return savedProduct;
  }

  // GET PRODUCT BY ID
  async getProductByIdService(id: string): Promise<ProductResponseDto> {
    const product: ProductResponseDto =
      await this.productsRepository.getProductByIdRepository(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} was not found`);
    }

    return product;
  }

  // UPDATE PRODUCT BY ID
  async updateProductService(
    id: string,
    updatedProduct: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const existingProduct: ProductResponseDto =
      await this.productsRepository.getProductByIdRepository(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} was not found`);
    }

    // Validar si al menos un campo fue enviado
    if (
      Object.values(updatedProduct).every(
        (value) => value === undefined || value === null,
      )
    ) {
      throw new BadRequestException(
        'At least one field must be provided for update.',
      );
    }

    // Convertimos updatedProduct a un objeto que sea compatible con Partial<Products>
    const productToUpdate: Partial<ProductResponseDto> = {};

    if (updatedProduct.name) {
      const foundProduct: ProductResponseDto =
        await this.productsRepository.getProductByNameRepository(
          updatedProduct.name,
        );
      if (foundProduct)
        throw new ConflictException(`Product name already exist`);
      productToUpdate.name = updatedProduct.name;
    }
    if (updatedProduct.description)
      productToUpdate.description = updatedProduct.description;
    if (updatedProduct.price) productToUpdate.price = updatedProduct.price;
    if (updatedProduct.imgUrl) productToUpdate.imgUrl = updatedProduct.imgUrl;
    if (updatedProduct.stock) productToUpdate.stock = updatedProduct.stock;

    if (updatedProduct.category) {
      let newCategory: CategoryResponseDto =
        await this.categoriesRepository.getCategoryByNameRepository(
          updatedProduct.category,
        );

      if (!newCategory) {
        const addedCategory: InsertResult =
          await this.categoriesRepository.addCategoriesRepository({
            category: updatedProduct.category, // Se pasa el objeto correcto para que no haya problemas con el tipo que recibe el método en el repositorio
          });
        if (
          !addedCategory.identifiers ||
          addedCategory.identifiers.length === 0
        ) {
          throw new BadRequestException(`Category has not been created`);
        }
        const addedCategoryId: string = addedCategory.identifiers[0].id;
        newCategory =
          await this.categoriesRepository.getCategoryByIdRepository(
            addedCategoryId,
          );
      }

      productToUpdate.category = newCategory;
    }

    await this.productsRepository.updateProductRepository(id, productToUpdate);
    return this.productsRepository.getProductByIdRepository(id);
  }

  // DELETE PRODUCT BY ID
  async deleteProductService(id: string): Promise<ProductResponseDto> {
    const productToDelete: ProductResponseDto =
      await this.productsRepository.getProductByIdRepository(id);

    if (!productToDelete) {
      throw new NotFoundException(`Product with id ${id} was not found`);
    }
    await this.productsRepository.deleteProductRepository(productToDelete.id);

    const existingProductWithCategory: ProductResponseDto =
      await this.productsRepository.getProductByCategoryRepository(
        productToDelete.category.name,
      );
    if (!existingProductWithCategory) {
      await this.categoriesRepository.deleteCategoryByIdRepository(
        productToDelete.category.id,
      );
    }
    return productToDelete;
  }
}
