import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './orders.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  addOrderController(@Body() order: CreateOrderDto) {
    return this.orderService.addOrderService(order);
  }

  @Get(':id')
  getOrderController(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.getOrderService(id);
  }
}

// @Post()
//   addOrderController(@Body() order: any) {
//     const { userId, products } = order;
//     return this.orderService.addOrderService(userId, products);
//   }
