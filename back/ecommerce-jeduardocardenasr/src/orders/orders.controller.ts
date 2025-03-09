import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dtos/ordersDtos/orders.dto';
import { AuthGuard } from '../Auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { Rol } from '../enums/roles.enum';
import { RolesGuard } from '../Auth/guards/roles.guard';
import { OrderResponseDto } from '../dtos/ordersDtos/order-response.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiResponse({ status: 400, description: 'Invalid order data' })
@ApiResponse({ status: 401, description: 'Unauthorized access' })
@ApiResponse({
  status: 500,
  description: 'Internal server error. Please try again later.',
})
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  //GET ALL ORDERS
  @Get()
  @ApiOperation({ summary: 'Retrieve all orders (Admin only)' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination (default is 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default is 5)',
    type: Number,
    example: 5,
  })
  @Roles(Rol.Administrator)
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'List of orders retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can access this data',
  })
  @ApiResponse({ status: 404, description: 'No orders found' })
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

  // CREATE ORDERS
  @Post()
  @ApiOperation({ summary: 'Create a new order (Authenticated users only)' })
  @ApiBody({
    description: 'Product data to create',
    type: CreateOrderDto,
    required: true,
  })
  @ApiResponse({ status: 201, description: 'Order successfully created' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({
    status: 409,
    description: 'Product is out of stock and cannot be added to an order.',
  })
  addOrderController(@Body() order: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.addOrderService(order);
  }

  // GET ORDER BY ID
  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID (Authenticated users only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID (UUID format)',
    example: '087513fe-0e35-4ab3-a5da-e367ec122074',
  })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getOrderByIdController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderResponseDto> {
    return this.orderService.getOrderByIdService(id);
  }
}
