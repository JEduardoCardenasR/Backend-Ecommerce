import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Headphones',
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality wireless headphones with noise cancellation.',
    minLength: 3,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 99.99,
    type: Number,
  })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Product stock',
    example: 150,
  })
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/images/headphones.jpg',
  })
  @IsOptional()
  @IsString()
  imgUrl?: string;

  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
  })
  @IsNotEmpty()
  @Length(2, 50)
  @IsString()
  category: string;
}
