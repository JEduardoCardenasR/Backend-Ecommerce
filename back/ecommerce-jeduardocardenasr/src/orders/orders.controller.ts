import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  addOrderController(@Body() order: any) {
    const { userId, products } = order;
    return this.orderService.addOrderService(userId, products);
  }

  @Get(':id')
  getOrderController(@Query('id') id: string) {
    return this.orderService.getOrderService(id);
  }
}
