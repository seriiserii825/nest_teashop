import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { CartBaseDto } from './create-cart.dto';
import { ProductBasicDto } from 'src/product/dto/create-product.dto';

export class CartItemDto {
  @ApiProperty({ description: 'The ID of the cart item' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'The cart this item belongs to' })
  @IsOptional()
  @Type(() => CartBaseDto)
  cart?: CartBaseDto;

  @ApiProperty({ description: 'The product in the cart item' })
  @IsOptional()
  @IsInt()
  cart_id?: number;

  @ApiProperty({ description: 'Product' })
  @IsOptional()
  @Type(() => ProductBasicDto)
  product?: ProductBasicDto;

  @ApiProperty({ description: 'The ID of the product' })
  @IsInt()
  @IsOptional()
  product_id?: number;

  @ApiProperty({ description: 'Quantity' })
  @IsOptional()
  @IsInt()
  quantity?: number;
}
