import { ApiProperty } from '@nestjs/swagger';
import { OrderDetails } from 'src/entities/orders_detail.entity';
import { Users } from 'src/entities/users.entity';

export class OrderResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the order',
    example: 'b2345678-c89d-12e3-f456-426614174000',
  })
  id: string;

  @ApiProperty({
    description:
      'Date when the order was placed (Structure must be FullYear-Month-Day)',
    example: '2024-03-01',
  })
  date: Date;

  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: 'Order details associated with this order',
    type: () => OrderDetails,
  })
  orderDetails: OrderDetails;

  @ApiProperty({
    description:
      'User who placed the order. If the user is deleted, this field will be set to NULL.',
    type: () => Users,
  })
  userActive: Users;
}
