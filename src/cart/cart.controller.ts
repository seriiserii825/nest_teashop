import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@AuthJwt()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOkResponse({ description: "Get the current user's cart" })
  @Get()
  getCart(@CurrentUser('id') user_id: number) {
    return this.cartService.getCart(user_id);
  }

  @Post('items')
  addItem(@CurrentUser('id') user_id: number, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(user_id, dto);
  }

  @Patch('items/:itemId')
  updateItem(
    @CurrentUser('id') user_id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(user_id, itemId, dto);
  }

  @Delete('items/:itemId')
  removeItem(
    @CurrentUser('id') user_id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.cartService.removeItem(user_id, itemId);
  }

  @Delete()
  clearCart(@CurrentUser('id') user_id: number) {
    return this.cartService.clearCart(user_id);
  }
}
