import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from '../entities/products.entity';
import { ProductsRepository } from 'src/products/products.repository';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async uploadImageService(file: Express.Multer.File, productId: string) {
    const product =
      await this.productsRepository.getProductByIdRepository(productId);

    //Verificando que el producto exista...
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    try {
      //Subida de la imagen
      const uploadedImage =
        await this.fileUploadRepository.uploadImageRepository(file);

      if (!uploadedImage?.secure_url) {
        throw new InternalServerErrorException(
          'Image upload failed, Cloudinary did not return a valid URL.',
        );
      }

      product.imgUrl = uploadedImage.secure_url;

      //Actualizar el producto
      await this.productsRepository.updateProductRepository(productId, product);

      return await this.productsRepository.getProductByIdRepository(productId);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new InternalServerErrorException(
        'Failed to upload image. Please try again later.',
      );
    }
  }
}
