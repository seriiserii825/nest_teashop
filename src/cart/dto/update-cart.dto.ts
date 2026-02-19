import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    example: 3,
    description: 'New quantity of the product in the cart',
  })
  @IsInt()
  @IsPositive()
  quantity: number;
}
