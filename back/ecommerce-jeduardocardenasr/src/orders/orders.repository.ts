import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from 'src/entities/orders.entity';
import { OrderDetails } from 'src/entities/orders_detail.entity';
import { Products } from 'src/entities/products.entity';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './orders.dto';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderDetails)
    private orderDetailRepository: Repository<OrderDetails>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async addOrder(orderData: CreateOrderDto) {
    let total = 0;

    const user = await this.usersRepository.findOneBy({ id: orderData.userId });

    if (!user) {
      throw new NotFoundException(
        `Usuario con id ${orderData.userId} no encontrado`,
      );
    }

    // Creamos la orden
    const order = new Orders();
    order.date = new Date();
    order.user = user;

    // Guardamos en la base de datos
    const newOrder = await this.ordersRepository.save(order);

    // Asociar cada id recibido con la entidad producto
    const productsArray = await Promise.all(
      orderData.products.map(async (productData) => {
        const product = await this.productsRepository.findOneBy({
          id: productData.id,
        });

        if (!product) {
          throw new NotFoundException(
            `Producto con id ${productData.id} no encontrado`,
          );
        }

        // Calculamos el monto total
        total += Number(product.price);

        // Actualizamos el stock
        await this.productsRepository.update(
          { id: productData.id },
          { stock: product.stock - 1 },
        );

        return product;
      }),
    );

    // Crear el detalle de la orden y guardarlo
    const orderDetail = new OrderDetails();
    orderDetail.price = Number(total.toFixed(2));
    orderDetail.products = productsArray.filter(
      (product): product is Products => typeof product !== 'string',
    );
    orderDetail.order = newOrder;

    await this.orderDetailRepository.save(orderDetail);

    return await this.ordersRepository.find({
      where: { id: newOrder.id },
      relations: { orderDetails: true },
    });

    //Muestra los productos
    // return await this.ordersRepository.find({
    //   where: { id: newOrder.id },
    //   relations: { orderDetails: { products: true } },
    // });
  }

  async getOrder(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Orden con id ${id} no encontrada`);
    }

    return order;
  }
}

// async addOrder(userId: string, products: any) {
//   let total = 0;

//   const user = await this.usersRepository.findOneBy({ id: userId });

//   if (!user) return `Usuario con id ${userId} no encontrado`;

//   //Creamos la orden
//   const order = new Orders();
//   order.date = new Date();
//   order.user = user;

//   //Guardamos en la base de datos
//   const newOrder = await this.ordersRepository.save(order);

//   //Asociar cada id recibido con la entidad producto
//   const productsArray = await Promise.all(
//     //Promise.all porque tiene que esperar que se hagan todos los registros
//     products.map(async (element) => {
//       const product = await this.productsRepository.findOneBy({
//         id: element.id,
//       });

//       if (!product) return `Producto con id ${element.id} no encontrado`;

//       //Calculamos el monto total
//       total += Number(product.price);

//       //Actualizamos el stock
//       await this.productsRepository.update(
//         { id: element.id },
//         { stock: product.stock - 1 },
//       );

//       return product;
//     }),
//   );

//   //Crear el detalle de la orden y la guardamos en la base de datos
//   const orderDetail = new OrderDetails();

//   orderDetail.price = Number(Number(total).toFixed(2));
//   orderDetail.products = productsArray;
//   orderDetail.order = newOrder;

//   //Guardamos el objeto
//   await this.orderDetailRepository.save(orderDetail);

//   return await this.ordersRepository.find({
//     where: { id: newOrder.id },
//     relations: {
//       orderDetails: true,
//     },
//   });
// }
