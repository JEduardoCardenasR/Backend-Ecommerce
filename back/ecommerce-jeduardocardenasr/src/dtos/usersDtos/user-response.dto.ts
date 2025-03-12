import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Orders } from '../../entities/orders.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Edu Cardi',
  })
  name: string;

  @ApiProperty({
    description: 'User email (must be unique)',
    example: 'educardi@mail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Hashed user password',
    example: 'hashedpassword123',
  })
  password: string;

  @ApiProperty({
    description: 'User phone number',
    example: 8441234567,
  })
  phone: number;

  @ApiProperty({
    description: 'User address',
    example: '1234 Elm Street, NY',
  })
  address: string;

  @ApiPropertyOptional({
    description: 'User country',
    example: 'México',
  })
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'City of the user',
    example: 'SaltiYork',
  })
  @IsOptional()
  city?: string;

  @ApiHideProperty()
  isAdmin: boolean;

  @ApiProperty({
    description: 'Date of birth (Structure must be FullYear-Month-Day)',
    example: '2024-03-01',
    required: true,
  })
  dateOfBirth: string;

  @ApiProperty({
    description: 'List of orders placed by the user',
    type: () => [Orders],
  })
  orders: Orders[];
}
