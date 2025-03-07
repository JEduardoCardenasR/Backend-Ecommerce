import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from '../entities/orders.entity';
import { OrderDetails } from '../entities/orders_detail.entity';
import { Products } from '../entities/products.entity';
import { Users } from '../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderDetails)
    private orderDetailRepository: Repository<OrderDetails>,
  ) {}

  async getOrdersRepository(skip: number, limit: number) {
    return await this.ordersRepository.find({
      relations: {
        orderDetails: {
          products: true, // Aquí se agrega la relación con los productos
        },
      },
      take: limit,
      skip: skip,
    });
  }

  // Guardar la orden
  async saveOrder(order: Orders): Promise<Orders> {
    return this.ordersRepository.save(order);
  }

  // Guardar los detalles de la orden
  async saveOrderDetail(orderDetail: OrderDetails): Promise<OrderDetails> {
    return this.orderDetailRepository.save(orderDetail);
  }

  // Devuelve la orden con los detalles
  async getOrderWithDetails(id: string): Promise<Orders> {
    return this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });
  }
}
// async addOrder(orderData: CreateOrderDto) {
//   let total = 0;

//   const user = await this.usersRepository.findOneBy({ id: orderData.userId });

//   if (!user) {
//     throw new NotFoundException(
//       `Usuario con id ${orderData.userId} no encontrado`,
//     );
//   }

//   // Creamos la orden
//   const order = new Orders();
//   order.date = new Date();
//   order.user = user;

//   // Guardamos en la base de datos
//   const newOrder = await this.ordersRepository.save(order);

//   // Asociar cada id recibido con la entidad producto
//   const productsArray = await Promise.all(
//     orderData.products.map(async (productData) => {
//       const product = await this.productsRepository.findOneBy({
//         id: productData.id,
//       });

//       if (!product) {
//         throw new NotFoundException(
//           `Producto con id ${productData.id} no encontrado`,
//         );
//       }

//       // Calculamos el monto total
//       total += Number(product.price);

//       // Actualizamos el stock
//       await this.productsRepository.update(
//         { id: productData.id },
//         { stock: product.stock - 1 },
//       );

//       return product;
//     }),
//   );

//   // Crear el detalle de la orden y guardarlo
//   const orderDetail = new OrderDetails();
//   orderDetail.price = Number(total.toFixed(2));
//   orderDetail.products = productsArray.filter(
//     (product): product is Products => typeof product !== 'string',
//   );
//   orderDetail.order = newOrder;

//   await this.orderDetailRepository.save(orderDetail);

//   return await this.ordersRepository.find({
//     where: { id: newOrder.id },
//     relations: { orderDetails: true },
//   });

//   //Muestra los productos
//   // return await this.ordersRepository.find({
//   //   where: { id: newOrder.id },
//   //   relations: { orderDetails: { products: true } },
//   // });
// }

// async getOrder(id: string) {
//   const order = await this.ordersRepository.findOne({
//     where: { id },
//     relations: {
//       orderDetails: {
//         products: true,
//       },
//     },
//   });

//   if (!order) {
//     throw new NotFoundException(`Orden con id ${id} no encontrada`);
//   }

//   return order;
// }
// }

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

// //Encuentra el usuario por ID (Para verificar si existe)
// async findUserById(userId: string): Promise<Users | null> {
//   return this.usersRepository.findOneBy({ id: userId });
// }

// // Obtiene el producto por ID
// async getProductById(productId: string): Promise<Products> {
//   return this.productsRepository.findOneBy({ id: productId });
// }

// // Actualiza el stock del producto
// async updateProductStock(productId: string, newStock: number): Promise<void> {
//   await this.productsRepository.update(
//     { id: productId },
//     { stock: newStock },
//   );
// }
