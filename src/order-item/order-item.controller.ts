import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemService } from './order-item.service';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { Admin } from 'src/auth/decorators/admin.decorator';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Admin()
  @AuthJwt()
  @Post('store/:store_id')
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemService.create(createOrderItemDto);
  }

  @Get('store/:store_id')
  findAll() {
    return this.orderItemService.findAll();
  }

  @Get(':id/store/:store_id')
  findOne(@Param('id') id: string) {
    return this.orderItemService.findOne(+id);
  }

  @Admin()
  @AuthJwt()
  @Patch(':id/store/:store_id')
  update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemService.update(+id, updateOrderItemDto);
  }

  @Admin()
  @AuthJwt()
  @Delete(':id/store/:store_id')
  remove(@Param('id') id: string) {
    return this.orderItemService.remove(+id);
  }
}
