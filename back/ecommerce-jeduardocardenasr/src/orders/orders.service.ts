import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository: OrdersRepository) {}

  addOrderService(userId: string, products: any) {
    return this.ordersRepository.addOrder(userId, products);
  }

  getOrderService(id: string) {
    return this.ordersRepository.getOrder(id);
  }
}
