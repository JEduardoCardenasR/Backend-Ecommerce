import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { FileUploadRepository } from './file-upload.repository';
import { CloudinaryConfig } from '../config/cloudinary';
import { ProductsModule } from '../products/products.module';

@Module({
  // imports: [TypeOrmModule.forFeature([Products])],
  imports: [ProductsModule], //Se importa completamente el módulo de products
  controllers: [FileUploadController],
  providers: [FileUploadService, FileUploadRepository, CloudinaryConfig],
})
export class FileUploadModule {}
