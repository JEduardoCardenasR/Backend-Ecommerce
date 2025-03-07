import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Orders } from './orders.entity';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

@Entity({
  name: 'users',
})
export class Users {
  // @ApiProperty({
  //   description: 'Unique identifier of the user',
  //   example: '550e8400-e29b-41d4-a716-446655440000',
  // })
  @ApiHideProperty()
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
  @IsNotEmpty()
  @Length(2, 50)
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
  @IsEmail()
  @IsNotEmpty()
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
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User phone number',
    example: 1234567890,
  })
  @Column({
    type: 'bigint',
  })
  // @IsMobilePhone('any')
  @IsNotEmpty()
  phone: number;

  @ApiProperty({
    description: 'User address',
    example: '1234 Elm Street, NY',
  })
  @Column({
    type: 'text',
  })
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({
    description: 'User country',
    example: 'México',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    default: 'Not specified',
  })
  @Length(2, 50)
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'City of the user',
    example: 'SaltiYork',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    default: 'Not specified',
  })
  @Length(2, 50)
  @IsOptional()
  city?: string;

  // @ApiProperty({
  //   description: 'Defines if the user has admin privileges',
  //   example: true,
  // })
  @ApiHideProperty()
  @Column({
    type: 'boolean',
    default: false,
  })
  isAdmin: boolean;

  @ApiProperty({
    description: 'List of orders placed by the user',
    type: [Orders],
  })
  @OneToMany(() => Orders, (order) => order.userActive)
  // @JoinColumn({ name: 'order_id' })
  orders: Orders[];
}
