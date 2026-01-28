import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductBasicDto } from 'src/product/dto/create-product.dto';
import { Product } from 'src/product/entities/product.entity';

export class ReviewBasicDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Great product!' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  product_id: number;

  @ApiProperty({
    type: () => ProductBasicDto,
    description: 'List of reviews made by the user',
  })
  @ValidateNested()
  @Type(() => ProductBasicDto)
  products?: Product[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  store_id: number;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @IsDate()
  updatedAt: Date;
}

export class CreateReviewDto extends PickType(ReviewBasicDto, [
  'text',
  'rating',
  'product_id',
]) {}
