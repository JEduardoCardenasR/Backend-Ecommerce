import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Products } from './products.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'categories',
})
export class Categories {
  @ApiProperty({
    description: 'Unique identifier of the category',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  name: string;

  @ApiProperty({
    description: 'List of products that belong to this category',
    type: [Products],
  })
  @OneToMany(() => Products, (product) => product.category)
  @JoinColumn({ name: 'product_id' })
  products: Products[];
}
