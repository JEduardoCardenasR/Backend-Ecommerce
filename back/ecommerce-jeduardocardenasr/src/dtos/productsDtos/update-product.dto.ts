import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Wireless Headphones',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'High-quality wireless headphones with noise cancellation.',
    minLength: 3,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({
    description: 'Product price',
    example: 99.99,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Product stock',
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/images/headphones.jpg',
  })
  @IsOptional()
  @IsString()
  imgUrl?: string;

  @ApiPropertyOptional({
    description: 'Name of the category',
    example: 'Electronics',
  })
  @IsOptional()
  @Length(2, 50)
  @IsString()
  category?: string;
}
