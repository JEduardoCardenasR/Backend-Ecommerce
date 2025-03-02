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
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';

@Entity({
  name: 'orders',
})
export class Orders {
  // @ApiProperty({
  //   description: 'Unique identifier of the order',
  //   example: 'b2345678-c89d-12e3-f456-426614174000',
  // })
  @ApiHideProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description:
      'Date when the order was placed (Structure must be FullYear-Month-Day)',
    example: '2024-03-01',
  })
  @Column({ type: 'date' })
  @IsDate()
  @IsNotEmpty()
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
