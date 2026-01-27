import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { CreateOrderDto, OrderBasicDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { Admin } from 'src/auth/decorators/admin.decorator';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @AuthJwt()
  @Admin()
  @Post('place')
  @ApiBody({ type: CreateOrderDto })
  @ApiOkResponse({ type: OrderBasicDto })
  create(
    @CurrentUser('id') user_id: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(createOrderDto, +user_id);
  }

  @Get()
  @ApiOkResponse({ type: [OrderBasicDto] })
  findAll(@CurrentUser('id') user_id: string) {
    return this.orderService.findAll(+user_id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiOkResponse({ type: OrderBasicDto })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }
}
