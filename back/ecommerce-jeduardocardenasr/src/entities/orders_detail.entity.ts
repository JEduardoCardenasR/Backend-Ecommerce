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
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsPositive } from 'class-validator';

@Entity({
  name: 'orderdetails',
})
export class OrderDetails {
  @ApiHideProperty()
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
  @IsDecimal()
  @IsPositive()
  @IsNotEmpty()
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
