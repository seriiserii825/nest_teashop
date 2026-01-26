import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class OrderItemsBasicDto {
  @ApiProperty({ example: 1, description: 'Order Item ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 2, description: 'Order ID' })
  @IsNumber()
  order_id: number;

  @ApiProperty({ example: 3, description: 'Quantity of the product' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 29.99, description: 'Price of the product' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 4, description: 'Product ID' })
  @IsNumber()
  product_id: number;

  @ApiProperty({ example: 5, description: 'Store ID' })
  @IsNumber()
  store_id: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'The date and time when the order item was created',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T00:00:00Z',
    description: 'The date and time when the order item was last updated',
  })
  @IsDate()
  updatedAt: Date;
}
export class CreateOrderItemDto {}
