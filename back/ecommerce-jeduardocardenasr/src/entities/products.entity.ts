import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categories } from './categories.entity';
import { OrderDetails } from './orders_detail.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, Length } from 'class-validator';

@Entity({
  name: 'products',
})
export class Products {
  @ApiHideProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Mouse',
  })
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Ergonomic wireless mouse with adjustable DPI settings.',
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 29.99,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Available stock of the product',
    example: 150,
  })
  @Column({
    type: 'int',
    nullable: false,
  })
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/images/headphones.jpg',
  })
  @Column({
    type: 'text',
    default:
      'https://takka.mx/wp-content/uploads/2024/11/TakkaMx-Proximamente.png',
  })
  @IsNotEmpty()
  imgUrl: string;

  @ApiProperty({
    description: 'Category to which the product belongs',
    type: () => Categories,
  })
  @ManyToOne(() => Categories, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Categories;

  @ApiProperty({
    description: 'List of order details that include this product',
    type: [OrderDetails],
  })
  @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.products)
  orderDetails: OrderDetails[];
}
