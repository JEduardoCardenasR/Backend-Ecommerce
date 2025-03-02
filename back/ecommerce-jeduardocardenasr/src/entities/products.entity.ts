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
import { IsDecimal, IsNotEmpty, IsPositive, Length } from 'class-validator';

@Entity({
  name: 'products',
})
export class Products {
  // @ApiProperty({
  //   description: 'Unique identifier of the product',
  //   example: '123e4567-e89b-12d3-a456-426614174000',
  // })
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
  @IsPositive()
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
  @IsPositive()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/images/headphones.jpg',
  })
  @Column({
    type: 'text',
    default: '../assets/images/DefaultImage.jpg',
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
