import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './orders.dto';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository: OrdersRepository) {}

  addOrderService(orderData: CreateOrderDto) {
    return this.ordersRepository.addOrder(orderData);
  }

  getOrderService(id: string) {
    return this.ordersRepository.getOrder(id);
  }
}

// addOrderService(userId: string, products: any) {
//   return this.ordersRepository.addOrder(userId, products);
// }
