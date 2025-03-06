import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from '../entities/orders_detail.entity';
import { Orders } from '../entities/orders.entity';
import { Users } from '../entities/users.entity';
import { Products } from '../entities/products.entity';
import { OrdersRepository } from './orders.repository';
import { UsersRepository } from 'src/users/users.repository';
import { ProductsRepository } from 'src/products/products.repository';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([Orders, OrderDetails, Users]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, UsersRepository],
})
export class OrdersModule {}
