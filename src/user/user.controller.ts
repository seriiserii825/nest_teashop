import { TypedParam, TypedRoute } from '@nestia/core';
import { Controller, Delete, Get, Param } from '@nestjs/common';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { tags } from 'typia';
import { CurrentUser } from './decorators/user.decorator';
import { UserService } from './user.service';

@AuthJwt()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @TypedRoute.Patch('favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') userId: number,
    @TypedParam('productId') productId: number & tags.Type<'uint32'>,
  ) {
    return this.userService.toggleFavorite(productId, userId);
  }
}
