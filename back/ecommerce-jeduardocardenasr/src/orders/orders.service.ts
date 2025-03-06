import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from '../dtos/orders.dto';
import { Orders } from '../entities/orders.entity';
import { OrderDetails } from '../entities/orders_detail.entity';
import { UsersRepository } from 'src/users/users.repository';
import { ProductsRepository } from 'src/products/products.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  getOrdersService(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.ordersRepository.getOrdersRepository(skip, limit);
  }

  async addOrderService(orderData: CreateOrderDto) {
    const user = await this.usersRepository.getUserByIdRepository(
      orderData.userId,
    );

    if (!user) {
      throw new NotFoundException(
        `User with id ${orderData.userId} was not found`,
      );
    }

    let total = 0;
    const productsArray = [];

    // Lógica de productos
    for (const productData of orderData.products) {
      const product = await this.productsRepository.getProductByIdRepository(
        productData.id,
      );

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
    order.user = user;

    // Guardamos la orden
    const newOrder = await this.ordersRepository.saveOrder(order);

    // Guardar orderDetails sin los productos primero
    const orderDetail = new OrderDetails();
    orderDetail.price = Number(total.toFixed(2));
    orderDetail.order = newOrder;

    const savedOrderDetail =
      await this.ordersRepository.saveOrderDetail(orderDetail);

    // Luego asignar los productos y guardar de nuevo. Esto asegura que OrderDetails primero exista en la BD antes de intentar relacionarlo con productos.
    savedOrderDetail.products = productsArray;
    await this.ordersRepository.saveOrderDetail(savedOrderDetail);

    // Retorna la orden con detalles
    return this.ordersRepository.getOrderWithDetails(newOrder.id);
  }

  async getOrderService(id: string) {
    const order = await this.ordersRepository.getOrderWithDetails(id);

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
