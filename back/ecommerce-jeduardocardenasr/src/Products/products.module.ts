import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../entities/products.entity';
import { Categories } from '../entities/categories.entity';
import { CategoriesRepository } from '../categories/categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Categories])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, CategoriesRepository],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
