import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Products } from '../entities/products.entity';
import { UpdateProductDto } from 'src/dtos/update-product.dto';
import { data } from '../utils/Archivo_actividad_3';
import { CategoriesRepository } from 'src/categories/categories.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async getProductsService(
    page: number,
    limit: number,
  ): Promise<{
    products: Products[];
    totalPages: number;
    totalProducts: number;
  }> {
    const [products, totalProducts] =
      await this.productsRepository.getProductsRepository(page, limit);

    const totalPages = Math.ceil(totalProducts / limit);

    return { products, totalPages, totalProducts };
  }

  async getProductByIdService(id: string): Promise<Products> {
    const product = await this.productsRepository.getProductByIdRepository(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} was not found`);
    }

    return product;
  }

  async addProductsService() {
    const categories =
      await this.productsRepository.findCategoriesInProductsRepository();

    for (const element of data) {
      const category = categories.find((cat) => cat.name === element.category);

      const product = new Products();
      product.name = element.name;
      product.description = element.description;
      product.price = element.price;
      product.imgUrl = element.imgUrl;
      product.stock = element.stock;
      product.category = category;

      this.productsRepository.addProductRepository(product);
    }
    return 'Products succesfully added';
  }

  //Hay que dar la posibilidad de que actualice la categoría pero hay que aplicar una lógica distinta y además hay que cambiar el dto y también habría que modificar el tema de las categorías si existe o no la categoría que se está incluyendo para agregar o no una nueva
  async updateProductService(
    id: string,
    updatedProduct: UpdateProductDto,
  ): Promise<Products> {
    await this.productsRepository.updateProductRepository(id, updatedProduct);
    return this.productsRepository.getProductByIdRepository(id);
  }

  async createProductService(newProduct) {
    if (!newProduct.category) {
      throw new BadRequestException(`Property category must be added`);
    }

    let newCategory =
      await this.categoriesRepository.getCategoryByNameRepository(
        newProduct.category,
      );

    if (!newCategory) {
      const addedCategory =
        await this.categoriesRepository.addCategoriesRepository(newProduct);

      if (
        !addedCategory.identifiers ||
        addedCategory.identifiers.length === 0
      ) {
        throw new BadRequestException(`Category has not been created`);
      }

      const addedCategoryId = addedCategory.identifiers[0].id;
      newCategory =
        await this.categoriesRepository.getCategoryByIdRepository(
          addedCategoryId,
        );
    }
    const productWithCategory = new Products();
    productWithCategory.name = newProduct.name;
    productWithCategory.description = newProduct.description;
    productWithCategory.price = newProduct.price;
    productWithCategory.imgUrl = newProduct.imgUrl;
    productWithCategory.stock = newProduct.stock;
    productWithCategory.category = newCategory;

    const addedProduct =
      await this.productsRepository.addProductRepository(productWithCategory);

    if (!addedProduct.identifiers || addedProduct.identifiers.length === 0) {
      throw new BadRequestException(`Product has not been created`);
    }

    const addedProductId = addedProduct.identifiers[0].id;
    const savedProduct =
      await this.productsRepository.getProductByIdRepository(addedProductId);

    return savedProduct;
  }

  async deleteProductService(id: string): Promise<Products> {
    const productToDelete =
      await this.productsRepository.getProductByIdRepository(id);

    if (!productToDelete) {
      throw new NotFoundException(`Product with id ${id} was not found`);
    }
    await this.productsRepository.deleteProductRepository(productToDelete.id);

    return productToDelete;
  }
}
