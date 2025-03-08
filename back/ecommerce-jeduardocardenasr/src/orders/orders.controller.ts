import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dtos/ordersDtos/orders.dto';
import { AuthGuard } from '../Auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Rol } from 'src/enums/roles.enum';
import { RolesGuard } from 'src/Auth/guards/roles.guard';
import { OrderResponseDto } from 'src/dtos/ordersDtos/order-response.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiSecurity('roles')
  @Roles(Rol.Administrator)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve all orders (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of orders retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can access this data',
  })
  getOrdersController(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<OrderResponseDto[]> {
    const pageNumber: number =
      page && !isNaN(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const limitNumber: number =
      limit && !isNaN(Number(limit)) && Number(limit) > 0 ? Number(limit) : 5;

    return this.orderService.getOrdersService(pageNumber, limitNumber);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order (Authenticated users only)' })
  @ApiResponse({ status: 201, description: 'Order successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  addOrderController(@Body() order: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.addOrderService(order);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID (Authenticated users only)' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  getOrderByIdController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderResponseDto> {
    return this.orderService.getOrderByIdService(id);
  }
}

// @Post()
//   addOrderController(@Body() order: any) {
//     const { userId, products } = order;
//     return this.orderService.addOrderService(userId, products);
//   }
