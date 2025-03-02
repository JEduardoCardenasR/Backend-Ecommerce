import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from '../entities/categories.entity';
import { ProductsRepository } from '../products/products.repository';
import { Products } from '../entities/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categories, Products])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, ProductsRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
