import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { OrderItemsBasicDto } from 'src/order-item/dto/create-order-item.dto';
import { OrderStatus } from '../entities/order.entity';

export class OrderBasicDto {
  @ApiProperty({ example: 1, description: 'Order ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'PENDING', description: 'Order status' })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ example: 100.5, description: 'Total amount of the order' })
  @IsNumber()
  total: number;

  @ApiPropertyOptional({ type: [OrderItemsBasicDto] })
  @Type(() => OrderItemsBasicDto)
  @IsOptional()
  items: OrderItemsBasicDto[];

  @IsNumber()
  user_id: number;

  @IsNumber()
  store_id?: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'The date and time when the order was created',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'The date and time when the order was created',
  })
  @IsDate()
  updatedAt: Date;
}

export class CreateOrderDto extends PickType(OrderBasicDto, [
  'status',
  'user_id',
  'items',
  'total',
]) {}
