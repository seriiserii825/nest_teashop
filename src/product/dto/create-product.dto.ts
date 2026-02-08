import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderItemsBasicDto } from 'src/order-item/dto/create-order-item.dto';
import { ReviewBasicDto } from 'src/review/dto/create-review.dto';
import { QueryProductDto } from './query-product.dto';

export class ProductBasicDto {
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
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999999.99)
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
  images: string[];

  @ApiProperty({ example: 1, description: 'Store ID' })
  @IsNumber()
  store_id: number;

  @ApiProperty({ example: 2, description: 'Category ID' })
  @IsNumber()
  category_id: number;

  @ApiProperty({ example: 3, description: 'ColorBasic ID' })
  @IsNumber()
  color_id: number;

  @ApiProperty({ example: 4, description: 'User ID' })
  @IsNumber()
  user_id: number;

  @ApiProperty({ example: 4.5, description: 'Average Rating' })
  @IsNumber({ maxDecimalPlaces: 1 })
  avg_rating?: number;

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

export class CreateProductDto extends PickType(ProductBasicDto, [
  'title',
  'description',
  'price',
  'category_id',
  'color_id',
]) {}

export class ProductFullDto extends ProductBasicDto {
  @ApiProperty({
    type: () => [ReviewBasicDto],
    description: 'Product reviews',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewBasicDto)
  @IsOptional()
  reviews?: ReviewBasicDto[];

  @ApiProperty({
    type: () => [OrderItemsBasicDto],
    description: 'Order items',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemsBasicDto)
  @IsOptional()
  order_items?: OrderItemsBasicDto[];
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

export class ProductsPaginatedDto {
  @ApiProperty({ type: [ProductBasicDto], description: 'Array of products' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductBasicDto)
  data: ProductBasicDto[];

  @ApiProperty({ type: PaginationMetaDto, description: 'Pagination metadata' })
  @ValidateNested()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;

  @ApiPropertyOptional({ type: () => QueryProductDto })
  query: QueryProductDto;
}
