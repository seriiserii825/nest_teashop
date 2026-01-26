import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { CategoryResponseDto } from 'src/category/dto/create-category.dto';
import { OrderItemsResponseDto } from 'src/order/dto/create-order.dto';
import { ProductResponseDto } from 'src/product/dto/create-product.dto';
import { ReviewResponseDto } from 'src/review/dto/create-review.dto';

export class CreateStoreDto {
  @ApiProperty({ minLength: 2 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;
}

export class UpdateStoreDto {
  @ApiPropertyOptional({ minLength: 2 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @ApiPropertyOptional({ minLength: 10 })
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;
}

export class StoreResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  user_id: number;

  @ApiPropertyOptional({ type: [ProductResponseDto] })
  @Type(() => ProductResponseDto)
  @IsOptional()
  products?: ProductResponseDto[];

  @ApiPropertyOptional({ type: [CategoryResponseDto] })
  @Type(() => CategoryResponseDto)
  @IsOptional()
  categories?: CategoryResponseDto[];

  @ApiPropertyOptional({ type: [ReviewResponseDto] })
  @Type(() => ReviewResponseDto)
  @IsOptional()
  reviews?: ReviewResponseDto[];

  @ApiPropertyOptional({ type: [OrderItemsResponseDto] })
  @Type(() => OrderItemsResponseDto)
  @IsOptional()
  order_items?: OrderItemsResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class StoreRemoveResponseDto {
  @ApiProperty({ example: 'Store with id 4 removed successfully' })
  message: string;
}
