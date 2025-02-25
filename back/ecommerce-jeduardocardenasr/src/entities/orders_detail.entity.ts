import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Products } from './products.entity';
import { Orders } from './orders.entity';

@Entity({
  name: 'orderdetails',
})
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @OneToOne(() => Orders, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Orders;

  @ManyToMany(() => Products, (product) => product.orderDetails, {
    cascade: true,
  })
  @JoinTable({
    name: 'orderdetails_products',
    joinColumn: {
      name: 'orderdetail_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products: Products[];
}
