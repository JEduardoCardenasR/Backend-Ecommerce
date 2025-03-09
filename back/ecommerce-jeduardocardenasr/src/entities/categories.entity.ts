import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Products } from './products.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

@Entity({
  name: 'categories',
})
export class Categories {
  @ApiHideProperty()
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
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @ApiProperty({
    description: 'List of products that belong to this category',
    type: [Products],
  })
  @OneToMany(() => Products, (product) => product.category)
  products: Products[];
}
