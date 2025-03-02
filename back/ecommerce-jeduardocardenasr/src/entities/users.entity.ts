import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './orders.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'users',
})
export class Users {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Edu Cardi',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'User email (must be unique)',
    example: 'educardi@mail.com',
  })
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  email: string;

  @ApiProperty({
    description: 'Hashed user password',
    example: 'hashedpassword123',
  })
  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  password: string;

  @ApiProperty({
    description: 'User phone number',
    example: 1234567890,
  })
  @Column({
    type: 'bigint',
  })
  phone: number;

  @ApiProperty({
    description: 'User country',
    example: 'México',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    default: 'Not specified',
  })
  country: string;

  @ApiProperty({
    description: 'User address',
    example: '1234 Elm Street, NY',
  })
  @Column({
    type: 'text',
  })
  address: string;

  @ApiProperty({
    description: 'City of the user',
    example: 'SaltiYork',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    default: 'Not specified',
  })
  city: string;

  @ApiProperty({
    description: 'Defines if the user has admin privileges',
    example: true,
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  isAdmin: boolean;

  @ApiProperty({
    description: 'List of orders placed by the user',
    type: [Orders],
  })
  @OneToMany(() => Orders, (order) => order.user)
  @JoinColumn({ name: 'order_id' })
  orders: Orders[];
}
