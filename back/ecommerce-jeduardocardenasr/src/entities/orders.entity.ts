import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { OrderDetails } from './orders_detail.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'orders',
})
export class Orders {
  @ApiProperty({
    description: 'Unique identifier of the order',
    example: 'b2345678-c89d-12e3-f456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Date when the order was placed',
    example: '2024-03-01T12:00:00Z',
  })
  @Column()
  date: Date;

  @ApiProperty({
    description: 'Order details associated with this order',
    type: () => OrderDetails,
  })
  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order)
  orderDetails: OrderDetails;

  @ApiProperty({
    description: 'User who placed the order',
    type: () => Users,
  })
  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
