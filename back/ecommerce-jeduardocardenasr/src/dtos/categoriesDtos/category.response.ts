import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from '../productsDtos/product.response.dto';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the category',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
  })
  name: string;

  @ApiProperty({
    description: 'List of products that belong to this category',
    type: [ProductResponseDto],
  })
  products: ProductResponseDto[];
}
