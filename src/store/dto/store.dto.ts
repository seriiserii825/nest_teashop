import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { CategoryBasicDto } from 'src/category/dto/create-category.dto';
import { OrderItemsBasicDto } from 'src/order-item/dto/create-order-item.dto';
import { ProductBasicDto } from 'src/product/dto/create-product.dto';
import { ReviewBasicDto } from 'src/review/dto/create-review.dto';

export class StoreBasicDto {
  @ApiProperty({ minLength: 2 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  id: number;

  @ApiProperty({ minLength: 2 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @ApiPropertyOptional({ minLength: 10 })
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  @IsString()
  picture: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class StoreFullDto extends StoreBasicDto {
  @ApiPropertyOptional({ type: [ProductBasicDto] })
  @Type(() => ProductBasicDto)
  @IsOptional()
  products?: ProductBasicDto[];

  @ApiPropertyOptional({ type: [CategoryBasicDto] })
  @Type(() => CategoryBasicDto)
  @IsOptional()
  categories?: CategoryBasicDto[];

  @ApiPropertyOptional({ type: [ReviewBasicDto] })
  @Type(() => ReviewBasicDto)
  @IsOptional()
  reviews?: ReviewBasicDto[];

  @ApiPropertyOptional({ type: [OrderItemsBasicDto] })
  @Type(() => OrderItemsBasicDto)
  @IsOptional()
  order_items?: OrderItemsBasicDto[];
}

export class StoreRemoveDto {
  @ApiProperty({ example: 'Store with id 4 removed successfully' })
  message: string;
}

export class CreateStoreDto extends PickType(StoreBasicDto, ['title']) {}
export class UpdateStoreDto extends PartialType(
  PickType(StoreBasicDto, ['title', 'description']),
) {
  @ApiPropertyOptional({
    type: [String],
    description: 'Old image URLs to keep',
  })
  @IsOptional()
  @IsString({ each: true })
  old_images?: string[];
}
