import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { CartItemDto } from './cart-item.dto';

export class CartBaseDto {
  @ApiProperty({ description: 'The ID of the cart item' })
  @IsInt()
  id: number;

  @ApiProperty({
    type: () => CartItemDto,
    isArray: true,
    description: 'List of cart items',
  })
  @ApiPropertyOptional()
  @Type(() => CartItemDto)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  items?: CartItemDto[];

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'Last Update Date',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'Creation Date',
  })
  @IsDate()
  createdAt: Date;
}

export class AddCartItemDto {
  @ApiProperty({ description: 'The ID of the product to add' })
  @IsInt()
  product_id: number;

  @ApiProperty({
    description: 'The quantity of the product to add',
    default: 1,
  })
  @IsInt()
  @IsPositive()
  quantity: number = 1;
}
