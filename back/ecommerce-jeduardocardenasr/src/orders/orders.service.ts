import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from '../dtos/ordersDtos/orders.dto';
import { Orders } from '../entities/orders.entity';
import { OrderDetails } from '../entities/orders_detail.entity';
import { UsersRepository } from '../users/users.repository';
import { ProductsRepository } from '../products/products.repository';
import { OrderResponseDto } from '../dtos/ordersDtos/order-response.dto';
import { UserResponseDto } from '../dtos/usersDtos/user-response.dto';
import { ProductResponseDto } from '../dtos/productsDtos/product-response.dto';
import { OrderDetailsResponseDto } from '../dtos/ordersDtos/orderDetails-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  //GET ALL ORDERS
  async getOrdersService(
    page: number,
    limit: number,
  ): Promise<OrderResponseDto[]> {
    const skip: number = (page - 1) * limit;

    const orders: OrderResponseDto[] =
      await this.ordersRepository.getOrdersRepository(skip, limit);

    if (!orders || orders.length === 0) {
      throw new NotFoundException('No orders found');
    }

    return orders;
  }

  // CREATE ORDERS
  async addOrderService(orderData: CreateOrderDto): Promise<OrderResponseDto> {
    const user: UserResponseDto =
      await this.usersRepository.getUserByIdRepository(orderData.userId);

    if (!user) {
      throw new NotFoundException(
        `User with id ${orderData.userId} was not found`,
      );
    }

    let total: number = 0;
    const productsArray: ProductResponseDto[] = [];

    // Lógica de productos
    for (const productData of orderData.products) {
      const product: ProductResponseDto =
        await this.productsRepository.getProductByIdRepository(productData.id);

      if (!product) {
        throw new NotFoundException(
          `Product with id ${productData.id} was not found`,
        );
      }

      if (product.stock <= 0) {
        throw new ConflictException(
          `Product '${product.name}' (ID: ${product.id}) is out of stock and cannot be added to an order.`,
        );
      }

      // Calculamos el monto total
      total += Number(product.price);

      // Actualizamos el stock

      product.stock -= 1;

      await this.productsRepository.updateProductRepository(
        product.id,
        product,
      );

      productsArray.push(product);
    }

    // Creamos la orden
    const order = new Orders();
    order.date = new Date();
    order.userId = user.id;
    order.userActive = user;

    // Guardamos la orden
    const newOrder: OrderResponseDto =
      await this.ordersRepository.saveOrderRepository(order);

    // Guardar orderDetails sin los productos primero
    const orderDetail = new OrderDetails();
    orderDetail.price = Number(total.toFixed(2));
    orderDetail.order = newOrder;

    const savedOrderDetail: OrderDetailsResponseDto =
      await this.ordersRepository.saveOrderDetailRepository(orderDetail);

    // Luego asignar los productos y guardar de nuevo. Esto asegura que OrderDetails primero exista en la BD antes de intentar relacionarlo con productos.
    savedOrderDetail.products = productsArray;
    await this.ordersRepository.saveOrderDetailRepository(savedOrderDetail);

    // Retorna la orden con detalles
    return this.ordersRepository.getOrderByIdRespository(newOrder.id);
  }

  // GET ORDER BY ID
  async getOrderByIdService(id: string): Promise<OrderResponseDto> {
    const order: OrderResponseDto =
      await this.ordersRepository.getOrderByIdRespository(id);

    if (!order) {
      throw new NotFoundException(`Order with id ${id} was not found`);
    }

    return order;
  }
}
