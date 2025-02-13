import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}

  async uploadImageService(file: Express.Multer.File, productId: string) {
    const product = await this.productsRepository.findOneBy({ id: productId });

    //Verificando que el producto exista...
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    //Subida de la imagen
    const uploadedImage = await this.fileUploadRepository.uploadImage(file);

    //Actualizar el producto
    await this.productsRepository.update(productId, {
      imgUrl: uploadedImage.secure_url,
    });

    const findUpdatedProduct = await this.productsRepository.findOneBy({
      id: productId,
    });

    return findUpdatedProduct;
  }
}
