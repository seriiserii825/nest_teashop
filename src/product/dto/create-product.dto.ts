import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CategoryResponseDto } from 'src/category/dto/create-category.dto';
import { ColorResponseDto } from 'src/color/dto/create-color.dto';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { Review } from 'src/review/entities/review.entity';
import { StoreResponseDto } from 'src/store/dto/store.dto';
import { User } from 'src/user/entities/user.entity';

class Product {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Green Tea', description: 'Product Title' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'A refreshing green tea.',
    description: 'Product Description',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 9.99, description: 'Product Price' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example:
      '["http://example.com/image1.jpg", "http://example.com/image2.jpg"]',
    description: 'Product Images without domain',
  })
  @ArrayMinSize(1, { message: 'At least one image is required.' })
  @IsString({
    each: true,
  })
  images: string;

  @ApiProperty({ example: 1, description: 'Store ID' })
  @IsNumber()
  store_id: number;

  @ApiProperty({ example: 2, description: 'Category ID' })
  @IsNumber()
  category_id: number;

  @ApiProperty({ example: 3, description: 'Color ID' })
  @IsNumber()
  color_id: number;

  @ApiProperty({ example: 4, description: 'User ID' })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'Creation Date',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T00:00:00Z',
    description: 'Last Update Date',
  })
  @IsDate()
  updatedAt: Date;
}

export class CreateProductDto extends PickType(Product, [
  'title',
  'description',
  'price',
  'category_id',
  'color_id',
]) {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Product images (max 10 files)',
    required: false,
  })
  @IsOptional()
  images?: any[];
}

export class ProductResponseDto extends Product {
  @ApiProperty({
    type: () => StoreResponseDto,
    description: 'Store information',
  })
  @ValidateNested()
  @Type(() => StoreResponseDto)
  store: StoreResponseDto;

  @ApiProperty({
    type: () => CategoryResponseDto,
    description: 'Category information',
  })
  @ValidateNested()
  @Type(() => CategoryResponseDto)
  category: CategoryResponseDto;

  @ApiProperty({
    type: () => ColorResponseDto,
    description: 'Color information',
  })
  @ValidateNested()
  @Type(() => ColorResponseDto)
  color: ColorResponseDto;

  @ApiProperty({
    type: () => User,
    description: 'User who created the product',
  })
  @ValidateNested()
  @Type(() => User)
  user: User;

  @ApiProperty({
    type: () => [Review],
    description: 'Product reviews',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Review)
  @IsOptional()
  reviews?: Review[];

  @ApiProperty({
    type: () => [OrderItem],
    description: 'Order items',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  @IsOptional()
  order_items?: OrderItem[];
}

class PaginationMetaDto {
  @ApiProperty({ example: 100, description: 'Total number of items' })
  @IsNumber()
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  @IsNumber()
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  @IsNumber()
  limit: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  @IsNumber()
  totalPages: number;
}

export class AllProductsResponseDto {
  @ApiProperty({ type: [ProductResponseDto], description: 'Array of products' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductResponseDto)
  data: ProductResponseDto[];

  @ApiProperty({ type: PaginationMetaDto, description: 'Pagination metadata' })
  @ValidateNested()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
}
