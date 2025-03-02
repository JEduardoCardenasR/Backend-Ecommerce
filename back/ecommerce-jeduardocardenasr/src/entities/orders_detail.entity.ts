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
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'orderdetails',
})
export class OrderDetails {
  @ApiProperty({
    description: 'Unique identifier of the order detail',
    example: 'a1234567-b89c-12d3-e456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Price of the order detail',
    example: 99.99,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @ApiProperty({
    description: 'Order associated with this detail',
    type: () => Orders,
  })
  @OneToOne(() => Orders, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Orders;

  @ApiProperty({
    description: 'List of products included in this order detail',
    type: [Products],
  })
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
