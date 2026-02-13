import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { UserBasicDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@AuthJwt()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: [UserBasicDto] })
  findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  @ApiOkResponse({ type: UserBasicDto })
  getProfile(@CurrentUser() user: User): Promise<UserBasicDto> {
    return this.userService.findOne(+user.id);
  }

  @Patch('favorites/:product_id/store/:store_id')
  async toggleFavorite(
    @CurrentUser('id') user_id: number,
    @Param('product_id') product_id: string,
    @Param('store_id') store_id: string,
  ) {
    return this.userService.toggleFavorite(+user_id, +product_id, +store_id);
  }
}
