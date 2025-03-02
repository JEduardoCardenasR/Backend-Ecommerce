import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { Products } from '../entities/products.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Unique identifier of the user placing the order',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'List of products included in the order (Only ID is a must)',
    type: [Products],
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Sample Product',
        description: 'This is a sample product description.',
        price: 19.99,
        stock: 100,
        imgUrl: '../assets/images/sample-product.jpg',
        category: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Sample Category',
        },
        orderDetails: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Sample Product',
        description: 'This is a sample product description.',
        price: 19.99,
        stock: 100,
        imgUrl: '../assets/images/sample-product.jpg',
        category: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Sample Category',
        },
        orderDetails: [],
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  products: Partial<Products[]>;
}
