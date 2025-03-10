import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from '../entities/orders.entity';
import { OrderDetails } from '../entities/orders_detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderDetails)
    private orderDetailRepository: Repository<OrderDetails>,
  ) {}

  //GET ALL ORDERS
  async getOrdersRepository(skip: number, limit: number): Promise<Orders[]> {
    return await this.ordersRepository.find({
      relations: {
        orderDetails: {
          products: true,
        },
      },
      take: limit,
      skip: skip,
    });
  }

  // SAVE ORDER
  async saveOrderRepository(order: Orders): Promise<Orders> {
    return this.ordersRepository.save(order);
  }

  // SAVE ORDER DETAILS
  async saveOrderDetailRepository(
    orderDetail: OrderDetails,
  ): Promise<OrderDetails> {
    return this.orderDetailRepository.save(orderDetail);
  }

  // GET ORDER BY ID
  async getOrderByIdRespository(id: string): Promise<Orders> {
    return this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });
  }
}
