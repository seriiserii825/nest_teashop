import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { Store } from 'src/store/entities/store.entity';
import {
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

class Category {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the category',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'Electronics',
    description: 'The title of the category',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'A category for electronic products',
    description: 'The description of the category',
  })
  @IsString()
  description: string;

  @IsArray()
  products: Product[];

  @IsArray()
  store: Store;

  @ApiProperty({
    example: 1,
    description: 'The identifier of the store associated with the category',
  })
  @IsNumber()
  store_id: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'The date and time when the category was created',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T00:00:00Z',
    description: 'The date and time when the category was last updated',
  })
  @IsDate()
  updatedAt: Date;
}

export class CreateCategoryDto extends PickType(Category, [
  'title',
  'description',
]) {}

export class CategoryResponseDto extends Category {}
