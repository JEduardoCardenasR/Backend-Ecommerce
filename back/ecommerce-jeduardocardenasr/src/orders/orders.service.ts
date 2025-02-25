import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './orders.dto';
import { Orders } from '../entities/orders.entity';
import { OrderDetails } from '../entities/orders_detail.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async addOrderService(orderData: CreateOrderDto) {
    const user = await this.ordersRepository.findUserById(orderData.userId);

    if (!user) {
      throw new NotFoundException(
        `Usuario con id ${orderData.userId} no encontrado`,
      );
    }

    let total = 0;
    const productsArray = [];

    // Lógica de productos
    for (const productData of orderData.products) {
      const product = await this.ordersRepository.getProductById(
        productData.id,
      );

      if (!product) {
        throw new NotFoundException(
          `Producto con id ${productData.id} no encontrado`,
        );
      }

      // Calculamos el monto total
      total += Number(product.price);

      // Actualizamos el stock
      await this.ordersRepository.updateProductStock(
        productData.id,
        product.stock - 1,
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
      throw new NotFoundException(`Orden con id ${id} no encontrada`);
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
