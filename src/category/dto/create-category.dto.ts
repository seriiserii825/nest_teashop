import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductBasicDto } from 'src/product/dto/create-product.dto';

export class CategoryBasicDto {
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

export class CreateCategoryDto extends PickType(CategoryBasicDto, [
  'title',
  'description',
]) {}

export class CategoryFullDto extends CategoryBasicDto {
  @ApiPropertyOptional({ type: [ProductBasicDto] })
  @Type(() => ProductBasicDto)
  @IsOptional()
  products?: ProductBasicDto[];
}

export class CategoryWithProductsCountDto extends CategoryBasicDto {
  @ApiProperty({
    example: 10,
    description: 'The number of products in this category',
  })
  @IsNumber()
  products_count: number;
}
