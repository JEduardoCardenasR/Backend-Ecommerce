import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { ProductsRepository } from 'src/Products/products.repository';
import { Products } from 'src/entities/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categories, Products])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, ProductsRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
