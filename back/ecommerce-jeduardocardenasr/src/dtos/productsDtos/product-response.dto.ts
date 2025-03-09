import { ApiProperty } from '@nestjs/swagger';
import { Categories } from '../../entities/categories.entity';
import { OrderDetails } from '../../entities/orders_detail.entity';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Mouse',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Ergonomic wireless mouse with adjustable DPI settings.',
  })
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 29.99,
  })
  price: number;

  @ApiProperty({
    description: 'Available stock of the product',
    example: 150,
  })
  stock: number;

  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/images/headphones.jpg',
  })
  imgUrl: string;

  @ApiProperty({
    description: 'Category to which the product belongs',
    type: () => Categories,
  })
  category: Categories;

  @ApiProperty({
    description: 'List of order details that include this product',
    type: () => [OrderDetails],
  })
  orderDetails: OrderDetails[];
}
