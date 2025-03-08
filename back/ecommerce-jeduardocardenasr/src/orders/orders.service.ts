import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from '../dtos/ordersDtos/orders.dto';
import { Orders } from '../entities/orders.entity';
import { OrderDetails } from '../entities/orders_detail.entity';
import { UsersRepository } from 'src/users/users.repository';
import { ProductsRepository } from 'src/products/products.repository';
import { OrderResponseDto } from 'src/dtos/ordersDtos/order-response.dto';
import { UserResponseDto } from 'src/dtos/usersDtos/user-response.dto';
import { ProductResponseDto } from 'src/dtos/productsDtos/product-response.dto';
import { OrderDetailsResponseDto } from 'src/dtos/ordersDtos/orderDetails-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  getOrdersService(page: number, limit: number): Promise<OrderResponseDto[]> {
    const skip: number = (page - 1) * limit;
    return this.ordersRepository.getOrdersRepository(skip, limit);
  }

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
    console.log(savedOrderDetail);

    // Luego asignar los productos y guardar de nuevo. Esto asegura que OrderDetails primero exista en la BD antes de intentar relacionarlo con productos.
    savedOrderDetail.products = productsArray;
    await this.ordersRepository.saveOrderDetailRepository(savedOrderDetail);

    // Retorna la orden con detalles
    return this.ordersRepository.getOrderByIdRespository(newOrder.id);
  }

  async getOrderByIdService(id: string): Promise<OrderResponseDto> {
    const order: OrderResponseDto =
      await this.ordersRepository.getOrderByIdRespository(id);

    if (!order) {
      throw new NotFoundException(`Order with id ${id} was not found`);
    }

    return order;
  }
}

// addOrderService(orderData: CreateOrderDto) {
//   return this.ordersRepository.addOrder(orderData);
// }

// addOrderService(userId: string, products: any) {
//   return this.ordersRepository.addOrder(userId, products);
// }
