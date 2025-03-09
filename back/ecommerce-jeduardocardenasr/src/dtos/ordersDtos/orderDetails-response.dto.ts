import { ApiProperty } from '@nestjs/swagger';
import { Orders } from '../../entities/orders.entity';
import { Products } from '../../entities/products.entity';

export class OrderDetailsResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the order detail',
    example: 'a1234567-b89c-12d3-e456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Price of the order detail',
    example: 99.99,
  })
  price: number;

  @ApiProperty({
    description: 'Order associated with this detail',
    type: () => Orders,
  })
  order: Orders;

  @ApiProperty({
    description: 'List of products included in this order detail',
    type: () => [Products],
  })
  products: Products[];
}
