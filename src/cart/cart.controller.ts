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
import { AddCartItemDto, CartBaseDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { CartItemDto } from './dto/cart-item.dto';

@AuthJwt()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOkResponse({ type: CartBaseDto })
  @Get()
  getCart(@CurrentUser('id') user_id: number): Promise<CartBaseDto> {
    return this.cartService.getCart(user_id);
  }

  @ApiBody({ type: AddCartItemDto })
  @ApiOkResponse({ type: CartItemDto })
  @Post('items')
  addItem(@CurrentUser('id') user_id: number, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(user_id, dto);
  }

  @ApiBody({ type: UpdateCartItemDto })
  @ApiOkResponse({ type: CartItemDto })
  @Patch('items/:itemId')
  updateItem(
    @CurrentUser('id') user_id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(user_id, itemId, dto);
  }

  @ApiParam({
    name: 'itemId',
    type: 'integer',
    description: 'ID of the cart item to remove',
  })
  @ApiOkResponse({ description: 'Item removed from cart' })
  @Delete('items/:itemId')
  removeItem(
    @CurrentUser('id') user_id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.cartService.removeItem(user_id, itemId);
  }

  @ApiOkResponse({ description: 'Cart cleared' })
  @Delete()
  clearCart(@CurrentUser('id') user_id: number) {
    return this.cartService.clearCart(user_id);
  }
}
